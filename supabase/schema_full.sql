-- ==============================================================================
-- [ARCHIVED REFERENCE ONLY] CRM EMY: HISTORICAL CONSOLIDATED REFERENCE SCHEMA
-- ==============================================================================
-- ⚠️ IMPORTANT NOTICE:
-- Do NOT execute this file directly on existing databases.
-- The canonical, versioned migrations are located in: supabase/migrations/
-- Always apply migrations sequentially or via Supabase CLI: supabase db push
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 1. ENUMS
do $$ begin
  create type public.staff_role as enum ('Owner', 'Admin', 'Staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.staff_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.client_type as enum ('individual', 'business');
exception when duplicate_object then null; end $$;

-- 2. TEAM MEMBERS / PROFILES
create table if not exists public.team_members (
  id text primary key,
  name text not null,
  initials text not null,
  role text not null default 'Staff',
  email text not null,
  phone text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. INDIVIDUAL & BUSINESS CLIENTS TABLE
create table if not exists public.clients (
  id text primary key,
  name text not null,
  initials text not null,
  first_name text not null default '',
  middle_name text default '',
  last_name text not null default '',
  ssn text not null default '',
  dob text default '',
  filing_status text not null default 'single',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default 'CA',
  zip text not null default '',
  
  -- Spouse info (if married)
  spouse_first_name text default '',
  spouse_last_name text default '',
  spouse_ssn text default '',
  spouse_dob text default '',

  -- Active Engagement summary
  tax_year text not null default '2026',
  return_type text not null default '1040',
  status text not null default 'New',
  assigned_staff text not null default 'Amy Tran',

  -- Financials
  federal_tax numeric(12,2) not null default 0,
  fee numeric(12,2) not null default 650,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 650,

  -- State taxes & Dependents (JSONB arrays)
  state_taxes jsonb not null default '[]'::jsonb,
  dependents jsonb not null default '[]'::jsonb,

  -- Notes & metadata
  notes text default '',
  client_since text not null default 'Jan 10, 2024',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. TAX RETURN ENGAGEMENTS (Multi-year history per client)
create table if not exists public.tax_returns (
  id text primary key,
  client_id text not null references public.clients(id) on delete cascade,
  tax_year text not null,
  return_type text not null default 'Form 1040',
  filing_status text not null default 'Single',
  status text not null default 'New',
  assigned_staff text not null default 'Amy Tran',
  federal_tax_amount numeric(12,2) not null default 0,
  preparation_fee numeric(12,2) not null default 650,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 650,
  internal_notes text default '',
  taxpayer_name_snapshot text not null default '',
  address_snapshot text not null default '',
  filing_status_snapshot text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. CLIENT TAX DOCUMENTS
create table if not exists public.client_documents (
  id text primary key,
  client_id text not null references public.clients(id) on delete cascade,
  name text not null,
  size text not null default '150 KB',
  type text not null default 'PDF',
  tax_year text default '2026',
  file_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. CLIENT NOTES
create table if not exists public.client_notes (
  id text primary key,
  client_id text not null references public.clients(id) on delete cascade,
  author text not null default 'Amy Tran',
  content text not null,
  tax_year text default '2026',
  created_at timestamptz not null default now()
);

-- 7. BUSINESS CLIENTS & PARTNERS
create table if not exists public.businesses (
  id text primary key,
  tax_month text not null default '01',
  tax_year text not null default '2026',
  legal_name text not null,
  dba text default '',
  ein text not null,
  entity_type text not null default 'partnership_1065',
  return_type text not null default '1065',
  phone text default '',
  email text default '',
  address text default '',
  city text default '',
  state text default 'CA',
  zip text default '',
  federal_tax numeric(12,2) not null default 0,
  preparation_fee numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  finance_category text not null default 'tax_preparation',
  status text not null default 'new',
  assigned_staff text not null default 'Amy Tran',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_partners (
  id text primary key,
  business_id text not null references public.businesses(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  ssn text not null,
  dob text default '',
  phone text default '',
  email text default '',
  address text default '',
  ownership numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & OPEN POLICIES
-- ==============================================================================
alter table public.team_members enable row level security;
alter table public.clients enable row level security;
alter table public.tax_returns enable row level security;
alter table public.client_documents enable row level security;
alter table public.client_notes enable row level security;
alter table public.businesses enable row level security;
alter table public.business_partners enable row level security;

-- Allow anon / authenticated access for CRM office usage
create policy "Allow all access to team_members" on public.team_members for all using (true) with check (true);
create policy "Allow all access to clients" on public.clients for all using (true) with check (true);
create policy "Allow all access to tax_returns" on public.tax_returns for all using (true) with check (true);
create policy "Allow all access to client_documents" on public.client_documents for all using (true) with check (true);
create policy "Allow all access to client_notes" on public.client_notes for all using (true) with check (true);
create policy "Allow all access to businesses" on public.businesses for all using (true) with check (true);
create policy "Allow all access to business_partners" on public.business_partners for all using (true) with check (true);

-- ==============================================================================
-- SEED INITIAL DATA (SAFE INSERT IF NOT EXISTS)
-- ==============================================================================

-- Seed Team Members
insert into public.team_members (id, name, initials, role, email, phone, status) values
('amy-tran', 'Amy Tran', 'AT', 'Owner', 'amy@taxcrm.com', '(714) 555-0101', 'active'),
('daniel-lee', 'Daniel Lee', 'DL', 'Admin', 'daniel@taxcrm.com', '(714) 555-0102', 'active'),
('sarah-kim', 'Sarah Kim', 'SK', 'Staff', 'sarah@taxcrm.com', '(714) 555-0103', 'active')
on conflict (id) do nothing;

-- Seed Sample Clients
insert into public.clients (
  id, name, initials, first_name, middle_name, last_name, ssn, dob, filing_status,
  phone, email, address, city, state, zip, tax_year, return_type, status, assigned_staff,
  federal_tax, fee, amount_paid, balance, state_taxes, dependents, notes
) values
(
  'minh-nguyen', 'Minh Nguyen', 'MN', 'Minh', '', 'Nguyen', '714-55-1234', '1985-03-14', 'single',
  '(714) 555-0184', 'minh.nguyen@example.com', '123 Bolsa Ave', 'Westminster', 'CA', '92683',
  '2026', '1040', 'Waiting Documents', 'Amy Tran',
  3200, 650, 325, 325,
  '[{"state": "CA", "amount": 980}]'::jsonb,
  '[]'::jsonb,
  'Awaiting W-2 and 1099-INT from client.'
),
(
  'olivia-johnson', 'Olivia Johnson', 'OJ', 'Olivia', 'R', 'Johnson', '415-22-5678', '1979-07-22', 'head_of_household',
  '(415) 555-0128', 'olivia.j@example.com', '456 Market St', 'San Francisco', 'CA', '94102',
  '2025', '1040', 'Review', 'Daniel Lee',
  5100, 875, 875, 0,
  '[{"state": "CA", "amount": 1540}]'::jsonb,
  '[{"fullName": "Emma Johnson", "ssn": "415-22-0001", "dob": "2010-05-12", "relationship": "Child", "phone": "", "address": ""}]'::jsonb,
  ''
),
(
  'kevin-mai-tran', 'Kevin & Mai Tran', 'KT', 'Kevin', '', 'Tran', '408-33-9012', '1981-11-05', 'married_jointly',
  '(408) 555-0192', 'ktran@example.com', '789 El Camino Real', 'Sunnyvale', 'CA', '94087',
  '2026', '1040', 'In Preparation', 'Sarah Kim',
  7800, 720, 500, 220,
  '[{"state": "CA", "amount": 2100}]'::jsonb,
  '[{"fullName": "Tommy Tran", "ssn": "408-33-0001", "dob": "2015-08-20", "relationship": "Child", "phone": "", "address": ""}, {"fullName": "Lily Tran", "ssn": "408-33-0002", "dob": "2018-03-11", "relationship": "Child", "phone": "", "address": ""}]'::jsonb,
  'Both spouses have W-2. Kevin has side income from consulting.'
)
on conflict (id) do nothing;

-- Seed Sample Tax Returns for Minh Nguyen
insert into public.tax_returns (
  id, client_id, tax_year, return_type, filing_status, status, assigned_staff,
  federal_tax_amount, preparation_fee, amount_paid, balance, internal_notes,
  taxpayer_name_snapshot, address_snapshot, filing_status_snapshot
) values
(
  'tr-minh-nguyen-2026', 'minh-nguyen', '2026', 'Form 1040', 'Single', 'Waiting Documents', 'Amy Tran',
  3200, 650, 325, 325, 'Annual engagement opened.',
  'Minh Nguyen', '123 Bolsa Ave, Westminster, CA 92683', 'Single'
),
(
  'tr-minh-nguyen-2025', 'minh-nguyen', '2025', 'Form 1040', 'Single', 'Completed', 'Daniel Lee',
  2800, 600, 600, 0, '2025 e-filed and accepted.',
  'Minh Nguyen', '123 Bolsa Ave, Westminster, CA 92683', 'Single'
)
on conflict (id) do nothing;

-- Seed Sample Documents for Minh Nguyen
insert into public.client_documents (id, client_id, name, size, type, tax_year) values
('doc-1', 'minh-nguyen', '2026_W2_Statement.pdf', '420 KB', 'PDF', '2026'),
('doc-2', 'minh-nguyen', '2025_Form1040_Final_Client_Copy.pdf', '1.2 MB', 'PDF', '2025'),
('doc-3', 'minh-nguyen', 'Identity_Verification_DriverLicense.pdf', '850 KB', 'PDF', 'General')
on conflict (id) do nothing;

-- Seed Sample Notes for Minh Nguyen
insert into public.client_notes (id, client_id, author, content, tax_year) values
('n-1', 'minh-nguyen', 'Amy Tran', 'Client confirmed they will upload 1099-NEC next week.', '2026'),
('n-2', 'minh-nguyen', 'Daniel Lee', '2025 IRS e-file accepted with standard deduction.', '2025')
on conflict (id) do nothing;
