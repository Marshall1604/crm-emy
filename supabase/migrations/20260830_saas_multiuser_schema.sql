-- ==============================================================================
-- CRM EMY: SaaS Multi-User, RBAC, Subscription & License Management Schema
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked 1:1 with auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  status text not null default 'active' check (status in ('active', 'blocked', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

-- Index for fast status & email queries
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_email on public.profiles(email);

-- ------------------------------------------------------------------------------
-- 2. ROLES, PERMISSIONS & RBAC TABLES
-- ------------------------------------------------------------------------------
create table if not exists public.roles (
  id text primary key, -- 'super_admin', 'admin', 'staff', 'user'
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id text primary key, -- e.g. 'users.view', 'subscriptions.manage', 'clients.*'
  name text not null,
  category text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id text not null references public.roles(id) on delete cascade,
  permission_id text not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id text not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);

-- ------------------------------------------------------------------------------
-- 3. PLANS & SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.plans (
  id text primary key, -- 'trial', 'monthly', 'yearly', 'lifetime'
  name text not null,
  description text,
  price numeric not null default 0,
  interval text not null, -- '7_days', 'month', 'year', 'lifetime'
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'trial',
  status text not null default 'trial' check (status in ('active', 'expired', 'cancelled', 'past_due', 'trial')),
  start_date timestamptz not null default now(),
  expire_date timestamptz,
  lifetime boolean not null default false,
  auto_renew boolean not null default false,
  payment_provider text not null default 'manual' check (payment_provider in ('manual', 'stripe', 'zelle', 'cash', 'bank_transfer', 'usdt', 'other')),
  payment_id text,
  amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_expire_date on public.subscriptions(expire_date);

-- ------------------------------------------------------------------------------
-- 4. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_target on public.audit_logs(target_user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- ------------------------------------------------------------------------------
-- 5. MULTI-TENANT ISOLATION (Add user_id to workspace data tables if not present)
-- ------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='clients' and column_name='user_id') then
    alter table public.clients add column user_id uuid references public.profiles(id) on delete cascade;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='tax_returns' and column_name='user_id') then
    alter table public.tax_returns add column user_id uuid references public.profiles(id) on delete cascade;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='team_members' and column_name='user_id') then
    alter table public.team_members add column user_id uuid references public.profiles(id) on delete cascade;
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 6. SECURITY DEFINER HELPER FUNCTIONS
-- ------------------------------------------------------------------------------

-- Check if user is super admin
create or replace function public.is_super_admin(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = check_user_id and role_id = 'super_admin'
  );
$$;

-- Check if user is admin or super admin
create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = check_user_id and role_id in ('super_admin', 'admin')
  );
$$;

-- Check if user has specific permission
create or replace function public.has_permission(check_user_id uuid, check_permission text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on ur.role_id = rp.role_id
    where ur.user_id = check_user_id and (rp.permission_id = check_permission or ur.role_id = 'super_admin')
  );
$$;

-- Check if user has active subscription
create or replace function public.has_active_subscription(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions
    where user_id = check_user_id
      and (
        lifetime = true
        or (status in ('active', 'trial') and (expire_date is null or expire_date > now()))
      )
  );
$$;

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: AUTOMATIC PROFILE & TRIAL SUBSCRIPTION ON USER REGISTRATION
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_first_user boolean;
  default_role text;
begin
  -- Check if this is the very first user (if so, make them super_admin)
  select not exists (select 1 from public.profiles) into is_first_user;

  if is_first_user then
    default_role := 'super_admin';
  else
    default_role := 'user';
  end if;

  -- 1. Create Profile
  insert into public.profiles (id, email, full_name, avatar_url, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  -- 2. Assign Default Role
  insert into public.user_roles (user_id, role_id)
  values (new.id, default_role)
  on conflict (user_id, role_id) do nothing;

  -- 3. Assign Subscription
  if is_first_user then
    -- Super Admin gets Lifetime subscription
    insert into public.subscriptions (user_id, plan, status, start_date, expire_date, lifetime, auto_renew, payment_provider, amount)
    values (new.id, 'lifetime', 'active', now(), null, true, false, 'manual', 0)
    on conflict do nothing;
  else
    -- Regular new user gets 7-day Trial
    insert into public.subscriptions (user_id, plan, status, start_date, expire_date, lifetime, auto_renew, payment_provider, amount)
    values (new.id, 'trial', 'trial', now(), now() + interval '7 days', false, false, 'manual', 0)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

-- Recreate trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.clients enable row level security;
alter table public.tax_returns enable row level security;
alter table public.team_members enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile or admins view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Users can update own profile (except status) or admins update all"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin(auth.uid()));

-- ROLES & PERMISSIONS POLICIES (Read-only for users, manageable by super_admin)
create policy "Anyone can read roles"
  on public.roles for select
  using (auth.role() = 'authenticated');

create policy "Anyone can read permissions"
  on public.permissions for select
  using (auth.role() = 'authenticated');

create policy "Anyone can read role_permissions"
  on public.role_permissions for select
  using (auth.role() = 'authenticated');

create policy "Users can view own user_roles or admins view all"
  on public.user_roles for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Only super_admin can mutate user_roles"
  on public.user_roles for all
  using (public.is_super_admin(auth.uid()));

-- PLANS POLICIES (Public read)
create policy "Anyone can view active plans"
  on public.plans for select
  using (true);

-- SUBSCRIPTIONS POLICIES
create policy "Users can view own subscription or admins view all"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Only admins can mutate subscriptions"
  on public.subscriptions for all
  using (public.is_admin(auth.uid()));

-- AUDIT LOGS POLICIES
create policy "Only admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin(auth.uid()));

create policy "Authenticated users can insert audit logs"
  on public.audit_logs for insert
  with check (auth.role() = 'authenticated');

-- CLIENTS & WORKSPACE DATA POLICIES (Strict Multi-Tenant Isolation)
create policy "Users can view own clients or authorized staff"
  on public.clients for select
  using (auth.uid() = user_id or user_id is null or public.has_permission(auth.uid(), 'clients.view'));

create policy "Users can insert own clients"
  on public.clients for insert
  with check (auth.uid() = user_id or user_id is null or public.has_permission(auth.uid(), 'clients.create'));

create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id or user_id is null or public.has_permission(auth.uid(), 'clients.edit'));

create policy "Users can delete own clients"
  on public.clients for delete
  using (auth.uid() = user_id or user_id is null or public.has_permission(auth.uid(), 'clients.delete'));

-- TAX RETURNS POLICIES
create policy "Users can view own tax returns"
  on public.tax_returns for select
  using (auth.uid() = user_id or user_id is null or public.is_admin(auth.uid()));

create policy "Users can mutate own tax returns"
  on public.tax_returns for all
  using (auth.uid() = user_id or user_id is null or public.is_admin(auth.uid()));

-- TEAM MEMBERS POLICIES
create policy "Users can view team members"
  on public.team_members for select
  using (auth.uid() = user_id or user_id is null or public.is_admin(auth.uid()));

create policy "Users can mutate own team members"
  on public.team_members for all
  using (auth.uid() = user_id or user_id is null or public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 9. SEED DATA (Default Roles, Permissions & Plans)
-- ------------------------------------------------------------------------------

-- Insert Roles
insert into public.roles (id, name, description)
values
  ('super_admin', 'Super Administrator', 'Full system access, role management, and root control.'),
  ('admin', 'Administrator', 'Business operations, user management, and subscription handling.'),
  ('staff', 'Tax Staff / Preparer', 'Client records, return preparation, and document processing.'),
  ('user', 'Standard User / Taxpayer', 'Personal tax dashboard and client self-service access.')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;

-- Insert Permissions
insert into public.permissions (id, name, category, description)
values
  ('users.view', 'View Users', 'Users', 'View user accounts and profiles'),
  ('users.create', 'Create Users', 'Users', 'Create new user accounts manually'),
  ('users.edit', 'Edit Users', 'Users', 'Modify user profiles and account statuses'),
  ('users.delete', 'Delete Users', 'Users', 'Permanently delete user accounts'),
  ('subscriptions.view', 'View Subscriptions', 'Subscriptions', 'View subscription records and payment statuses'),
  ('subscriptions.create', 'Create Subscriptions', 'Subscriptions', 'Manually grant subscriptions and licenses'),
  ('subscriptions.edit', 'Edit Subscriptions', 'Subscriptions', 'Extend or adjust subscription dates'),
  ('subscriptions.cancel', 'Cancel Subscriptions', 'Subscriptions', 'Cancel active subscriptions'),
  ('clients.view', 'View Clients', 'Clients', 'View client records and contact information'),
  ('clients.create', 'Create Clients', 'Clients', 'Add new individual and business clients'),
  ('clients.edit', 'Edit Clients', 'Clients', 'Update existing client information and returns'),
  ('clients.delete', 'Delete Clients', 'Clients', 'Delete client records from workspace'),
  ('payments.view', 'View Payments', 'Payments', 'View payment histories and revenue reports'),
  ('payments.manage', 'Manage Payments', 'Payments', 'Log manual payments (Zelle, Cash, Bank, USDT)'),
  ('settings.view', 'View Settings', 'Settings', 'View office and system configurations'),
  ('settings.edit', 'Edit Settings', 'Settings', 'Modify office settings and parameters'),
  ('roles.view', 'View Roles', 'Roles', 'View roles and permissions matrix'),
  ('roles.manage', 'Manage Roles', 'Roles', 'Assign roles to staff and users'),
  ('logs.view', 'View Audit Logs', 'Logs', 'Inspect security audit logs and system activity')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description;

-- Assign Permissions to Roles
-- Super Admin: All permissions
insert into public.role_permissions (role_id, permission_id)
select 'super_admin', id from public.permissions
on conflict do nothing;

-- Admin: All except roles.manage
insert into public.role_permissions (role_id, permission_id)
select 'admin', id from public.permissions
where id not in ('users.delete', 'roles.manage')
on conflict do nothing;

-- Staff: Client operations & view logs
insert into public.role_permissions (role_id, permission_id)
select 'staff', id from public.permissions
where id in ('clients.view', 'clients.create', 'clients.edit', 'subscriptions.view')
on conflict do nothing;

-- User: Own client records
insert into public.role_permissions (role_id, permission_id)
select 'user', id from public.permissions
where id in ('clients.view', 'clients.create', 'clients.edit')
on conflict do nothing;

-- Insert Plans
insert into public.plans (id, name, description, price, interval, features, is_active)
values
  ('trial', '7-Day Free Trial', 'Full access to individual and business tax management features for 7 days.', 0, '7_days', '["Individual 1040 returns", "Business Form 1065 / 1120 returns", "Document upload & storage", "7 days validity"]'::jsonb, true),
  ('monthly', 'Monthly Pro', 'Comprehensive monthly subscription for tax offices and accounting firms.', 49, 'month', '["Unlimited clients & businesses", "Multi-year return history", "Excel exports & reports", "Standard support", "Cancel anytime"]'::jsonb, true),
  ('yearly', 'Annual Enterprise', 'Best value yearly plan with priority assistance and advanced features.', 490, 'year', '["All Pro features included", "2 Months free savings", "Priority IRS e-file support", "Custom branding & exports", "Dedicated onboarding"]'::jsonb, true),
  ('lifetime', 'Lifetime Unlimited License', 'One-time payment for permanent unlimited access to all features.', 999, 'lifetime', '["Permanent access forever", "Never expires", "All future SaaS updates included", "VIP 24/7 dedicated support", "Unlimited staff & clients"]'::jsonb, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  interval = excluded.interval,
  features = excluded.features,
  is_active = excluded.is_active;
