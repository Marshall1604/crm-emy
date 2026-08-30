-- ==============================================================================
-- CRM EMY: FULL DATABASE RECONCILIATION & STRICT RLS (SAFE FOR EXISTING DATABASES)
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ROLES, PERMISSIONS & SECURITY FUNCTIONS (Fail-Closed RBAC)
-- ------------------------------------------------------------------------------
create table if not exists public.roles (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

insert into public.roles (id, name, description)
values
  ('super_admin', 'Super Administrator', 'Full system and license ownership'),
  ('admin', 'Administrator', 'Office manager with staff & return management'),
  ('staff', 'Tax Preparer / Staff', 'Tax return preparation and client servicing'),
  ('user', 'Standard User', 'Client or basic user account')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;

create table if not exists public.permissions (
  id text primary key,
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
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id text not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

alter table public.user_roles add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.user_roles add column if not exists role_id text references public.roles(id) on delete cascade;

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);

-- RBAC Database Helper Functions
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role_id in ('super_admin', 'admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role_id = 'super_admin'
  );
$$;

create or replace function public.is_staff_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role_id in ('super_admin', 'admin', 'staff')
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. PROFILES TABLE RECONCILIATION
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles add column if not exists last_sign_in_at timestamptz;

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_status on public.profiles(status);

-- ------------------------------------------------------------------------------
-- 4. CLIENTS TABLE & RECONCILIATION
-- ------------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  initials text,
  first_name text,
  middle_name text,
  last_name text,
  ssn text,
  ssn_encrypted bytea,
  ssn_last_four text,
  dob date,
  filing_status text not null default 'Single',
  phone text,
  email text,
  address text,
  city text,
  state text,
  zip text,
  spouse_first_name text,
  spouse_last_name text,
  spouse_ssn text,
  spouse_ssn_last_four text,
  spouse_dob date,
  tax_year text not null default '2025',
  return_type text not null default 'Form 1040',
  status text not null default 'Waiting Documents',
  assigned_staff text,
  federal_tax numeric(12,2) not null default 0,
  fee numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  state_taxes jsonb not null default '[]'::jsonb,
  dependents jsonb not null default '[]'::jsonb,
  notes text,
  client_since date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure all columns exist on previously created clients table
alter table public.clients add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.clients add column if not exists name text;
alter table public.clients add column if not exists initials text;
alter table public.clients add column if not exists first_name text;
alter table public.clients add column if not exists middle_name text;
alter table public.clients add column if not exists last_name text;
alter table public.clients add column if not exists ssn text;
alter table public.clients add column if not exists ssn_encrypted bytea;
alter table public.clients add column if not exists ssn_last_four text;
alter table public.clients add column if not exists dob date;
alter table public.clients add column if not exists filing_status text default 'Single';
alter table public.clients add column if not exists phone text;
alter table public.clients add column if not exists email text;
alter table public.clients add column if not exists address text;
alter table public.clients add column if not exists city text;
alter table public.clients add column if not exists state text;
alter table public.clients add column if not exists zip text;
alter table public.clients add column if not exists spouse_first_name text;
alter table public.clients add column if not exists spouse_last_name text;
alter table public.clients add column if not exists spouse_ssn text;
alter table public.clients add column if not exists spouse_ssn_last_four text;
alter table public.clients add column if not exists spouse_dob date;
alter table public.clients add column if not exists tax_year text default '2025';
alter table public.clients add column if not exists return_type text default 'Form 1040';
alter table public.clients add column if not exists status text default 'Waiting Documents';
alter table public.clients add column if not exists assigned_staff text;
alter table public.clients add column if not exists federal_tax numeric(12,2) default 0;
alter table public.clients add column if not exists fee numeric(12,2) default 0;
alter table public.clients add column if not exists amount_paid numeric(12,2) default 0;
alter table public.clients add column if not exists balance numeric(12,2) default 0;
alter table public.clients add column if not exists state_taxes jsonb default '[]'::jsonb;
alter table public.clients add column if not exists dependents jsonb default '[]'::jsonb;
alter table public.clients add column if not exists notes text;
alter table public.clients add column if not exists client_since date default current_date;

create index if not exists idx_clients_user_id on public.clients(user_id);
create index if not exists idx_clients_email on public.clients(email);
create index if not exists idx_clients_status on public.clients(status);

-- ------------------------------------------------------------------------------
-- 5. TAX RETURNS TABLE & RECONCILIATION
-- ------------------------------------------------------------------------------
create table if not exists public.tax_returns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_year text not null default '2025',
  return_type text not null default 'Form 1040',
  filing_status text not null default 'Single',
  status text not null default 'Waiting Documents',
  assigned_staff text,
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  federal_tax_amount numeric(12,2) not null default 0,
  preparation_fee numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  internal_notes text,
  taxpayer_name_snapshot text,
  address_snapshot text,
  filing_status_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tax_returns add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.tax_returns add column if not exists assigned_staff_id uuid references public.profiles(id) on delete set null;
alter table public.tax_returns add column if not exists taxpayer_name_snapshot text;
alter table public.tax_returns add column if not exists address_snapshot text;
alter table public.tax_returns add column if not exists filing_status_snapshot text;

create index if not exists idx_tax_returns_client_id on public.tax_returns(client_id);
create index if not exists idx_tax_returns_tax_year on public.tax_returns(tax_year);
create index if not exists idx_tax_returns_status on public.tax_returns(status);
create index if not exists idx_tax_returns_assigned_staff_id on public.tax_returns(assigned_staff_id);

-- ------------------------------------------------------------------------------
-- 6. BUSINESSES & PARTNERS
-- ------------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  dba text,
  ein text,
  ein_encrypted bytea,
  ein_last_four text,
  entity_type text not null default 'LLC',
  status text not null default 'Waiting Documents',
  assigned_staff text,
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  primary_contact text,
  federal_tax numeric(12,2) not null default 0,
  state_tax numeric(12,2) not null default 0,
  fee numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.businesses add column if not exists ein_encrypted bytea;
alter table public.businesses add column if not exists ein_last_four text;

create table if not exists public.business_partners (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  ownership_percentage numeric(5,2) not null default 0,
  ssn_last_four text,
  role text,
  created_at timestamptz not null default now()
);

create index if not exists idx_business_partners_biz_id on public.business_partners(business_id);

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOGS & SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id text,
  action text not null,
  entity_type text,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'trial',
  status text not null default 'trial',
  start_date timestamptz not null default now(),
  expire_date timestamptz,
  lifetime boolean not null default false,
  auto_renew boolean not null default false,
  payment_provider text not null default 'manual',
  payment_id text,
  amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.subscriptions add column if not exists plan text default 'trial';
alter table public.subscriptions add column if not exists status text default 'trial';
alter table public.subscriptions add column if not exists expire_date timestamptz;
alter table public.subscriptions add column if not exists lifetime boolean default false;
alter table public.subscriptions add column if not exists auto_renew boolean default false;

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ------------------------------------------------------------------------------
-- 8. STRICT ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.clients enable row level security;
alter table public.tax_returns enable row level security;
alter table public.businesses enable row level security;
alter table public.business_partners enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;

-- Drop old policies if existing
drop policy if exists "profiles_select_policy" on public.profiles;
drop policy if exists "profiles_update_policy" on public.profiles;
drop policy if exists "user_roles_select_policy" on public.user_roles;
drop policy if exists "user_roles_admin_manage_policy" on public.user_roles;
drop policy if exists "roles_select_policy" on public.roles;
drop policy if exists "permissions_select_policy" on public.permissions;
drop policy if exists "role_permissions_select_policy" on public.role_permissions;
drop policy if exists "clients_staff_manage_policy" on public.clients;
drop policy if exists "tax_returns_staff_manage_policy" on public.tax_returns;
drop policy if exists "businesses_staff_manage_policy" on public.businesses;
drop policy if exists "business_partners_staff_manage_policy" on public.business_partners;
drop policy if exists "subscriptions_select_policy" on public.subscriptions;
drop policy if exists "subscriptions_admin_manage_policy" on public.subscriptions;
drop policy if exists "audit_logs_admin_select_policy" on public.audit_logs;

-- Re-create safe policies
create policy "profiles_select_policy" on public.profiles
  for select using (auth.uid() = id or public.is_staff_or_admin());

create policy "profiles_update_policy" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "user_roles_select_policy" on public.user_roles
  for select using (auth.uid() = user_id or public.is_admin());

create policy "user_roles_admin_manage_policy" on public.user_roles
  for all using (public.is_admin());

create policy "roles_select_policy" on public.roles
  for select using (auth.role() = 'authenticated');

create policy "permissions_select_policy" on public.permissions
  for select using (auth.role() = 'authenticated');

create policy "role_permissions_select_policy" on public.role_permissions
  for select using (auth.role() = 'authenticated');

create policy "clients_staff_manage_policy" on public.clients
  for all using (public.is_staff_or_admin());

create policy "tax_returns_staff_manage_policy" on public.tax_returns
  for all using (public.is_staff_or_admin());

create policy "businesses_staff_manage_policy" on public.businesses
  for all using (public.is_staff_or_admin());

create policy "business_partners_staff_manage_policy" on public.business_partners
  for all using (public.is_staff_or_admin());

create policy "subscriptions_select_policy" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_admin());

create policy "subscriptions_admin_manage_policy" on public.subscriptions
  for all using (public.is_admin());

create policy "audit_logs_admin_select_policy" on public.audit_logs
  for select using (public.is_admin());
