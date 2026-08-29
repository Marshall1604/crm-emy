-- ==============================================================================
-- SUPABASE AUTHENTICATION & PROFILES TRIGGER MIGRATION
-- Project: CRM EMY SaaS
-- ==============================================================================

-- 1. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'blocked', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index on email & role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create Clean Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'admin')
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'admin')
    )
  );

-- 3. Automatic Profile Creation Trigger Function on auth.users
-- Ensures client cannot pass or forge 'role', default is ALWAYS 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_first_user BOOLEAN;
  assigned_role TEXT;
  user_full_name TEXT;
BEGIN
  -- Check if this is the first registered user
  SELECT (count(*) = 0) INTO is_first_user FROM public.profiles;

  -- Extract full_name from metadata or default to email prefix
  user_full_name := coalesce(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- First registered user becomes super_admin with lifetime license, subsequent users are 'user'
  IF is_first_user THEN
    assigned_role := 'super_admin';
  ELSE
    assigned_role := 'user';
  END IF;

  -- Insert profile record
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    assigned_role,
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = coalesce(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();

  -- Assign 7-Day Free Trial (or Lifetime for first super_admin)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan,
      status,
      start_date,
      expire_date,
      lifetime,
      auto_renew,
      payment_provider,
      amount,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      CASE WHEN assigned_role = 'super_admin' THEN 'lifetime' ELSE 'trial' END,
      'active',
      NOW(),
      CASE WHEN assigned_role = 'super_admin' THEN NULL ELSE NOW() + INTERVAL '7 days' END,
      CASE WHEN assigned_role = 'super_admin' THEN TRUE ELSE FALSE END,
      FALSE,
      'manual',
      0,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
