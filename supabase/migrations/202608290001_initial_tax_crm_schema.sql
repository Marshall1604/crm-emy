-- CRM EMY: initial normalized PostgreSQL schema for Supabase.
-- Sensitive identifiers are stored as encrypted bytea plus masked last-four values.

create extension if not exists pgcrypto;

create type public.staff_role as enum ('owner', 'admin', 'preparer');
create type public.staff_status as enum ('invited', 'active', 'disabled');
create type public.client_type as enum ('individual', 'business');
create type public.business_entity_type as enum (
  'sole_proprietor',
  'single_member_llc',
  'partnership_1065',
  's_corporation_1120s',
  'c_corporation_1120',
  'other'
);
create type public.tax_case_status as enum (
  'new',
  'waiting_documents',
  'documents_received',
  'in_preparation',
  'missing_information',
  'review',
  'signature_pending',
  'ready_to_file',
  'e_filed',
  'accepted',
  'rejected',
  'extension_filed',
  'completed'
);
create type public.jurisdiction_type as enum ('federal', 'state', 'local');
create type public.tax_amount_type as enum (
  'tax_due',
  'refund',
  'estimated_payment',
  'extension_payment',
  'balance_due',
  'penalty',
  'interest',
  'credit',
  'withholding',
  'other'
);
create type public.activity_action as enum (
  'created',
  'updated',
  'status_changed',
  'assigned',
  'note_added',
  'amount_recorded',
  'archived'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  role public.staff_role not null default 'preparer',
  status public.staff_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  client_type public.client_type not null,
  display_name text not null,
  first_name text,
  middle_name text,
  last_name text,
  ssn_encrypted bytea,
  ssn_last_four text check (ssn_last_four is null or ssn_last_four ~ '^[0-9]{4}$'),
  date_of_birth date,
  phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  zip_code text,
  assigned_preparer_id uuid references public.profiles(id) on delete set null,
  is_archived boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint individual_name_required check (
    client_type = 'business' or (first_name is not null and last_name is not null)
  )
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  month smallint check (month between 1 and 12),
  legal_business_name text not null,
  ein_encrypted bytea,
  ein_last_four text check (ein_last_four is null or ein_last_four ~ '^[0-9]{4}$'),
  entity_type public.business_entity_type not null,
  entity_type_other text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  zip_code text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint other_entity_type_description check (
    entity_type <> 'other' or nullif(trim(entity_type_other), '') is not null
  )
);

create table public.business_partners (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  ssn_encrypted bytea,
  ssn_last_four text check (ssn_last_four is null or ssn_last_four ~ '^[0-9]{4}$'),
  date_of_birth date,
  phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  zip_code text,
  ownership_percentage numeric(5,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_ownership_percentage check (
    ownership_percentage >= 0 and ownership_percentage <= 100
  )
);

create table public.tax_cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_year smallint not null check (tax_year between 1900 and 2200),
  month smallint check (month between 1 and 12),
  return_type text,
  preparation_fee numeric(12,2) not null default 0 check (preparation_fee >= 0),
  finance_category text,
  status public.tax_case_status not null default 'new',
  assigned_preparer_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tax_cases_id_client_unique unique (id, client_id),
  constraint unique_client_return_period unique nulls not distinct
    (client_id, tax_year, month, return_type)
);

-- One tax case can have Federal, unlimited State, and optional Local jurisdictions.
create table public.tax_jurisdictions (
  id uuid primary key default gen_random_uuid(),
  tax_case_id uuid not null references public.tax_cases(id) on delete cascade,
  jurisdiction_type public.jurisdiction_type not null,
  jurisdiction_code text not null,
  jurisdiction_name text not null,
  state_code text check (state_code is null or state_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jurisdiction_shape check (
    (jurisdiction_type = 'federal' and jurisdiction_code = 'US' and state_code is null)
    or (jurisdiction_type = 'state' and state_code is not null and jurisdiction_code = state_code)
    or (jurisdiction_type = 'local' and state_code is not null)
  ),
  constraint unique_case_jurisdiction unique (tax_case_id, jurisdiction_type, jurisdiction_code),
  constraint tax_jurisdictions_id_case_unique unique (id, tax_case_id)
);

-- Federal and State amounts are rows, not fixed columns.
create table public.tax_amounts (
  id uuid primary key default gen_random_uuid(),
  tax_case_id uuid not null references public.tax_cases(id) on delete cascade,
  jurisdiction_id uuid not null,
  amount_type public.tax_amount_type not null default 'tax_due',
  amount numeric(14,2) not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tax_amount_jurisdiction_case_fk
    foreign key (jurisdiction_id, tax_case_id)
    references public.tax_jurisdictions(id, tax_case_id) on delete cascade,
  constraint unique_case_amount unique (tax_case_id, jurisdiction_id, amount_type)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_case_id uuid,
  content text not null check (length(trim(content)) > 0),
  author_id uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint note_case_client_fk foreign key (tax_case_id, client_id)
    references public.tax_cases(id, client_id) on delete cascade
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_case_id uuid,
  actor_id uuid references public.profiles(id) on delete set null default auth.uid(),
  action public.activity_action not null,
  entity_type text not null,
  entity_id uuid,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_case_client_fk foreign key (tax_case_id, client_id)
    references public.tax_cases(id, client_id) on delete cascade,
  constraint activity_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create index clients_type_idx on public.clients(client_type) where not is_archived;
create index clients_assigned_preparer_idx on public.clients(assigned_preparer_id);
create index clients_display_name_idx on public.clients(lower(display_name));
create index businesses_legal_name_idx on public.businesses(lower(legal_business_name));
create index business_partners_business_idx on public.business_partners(business_id);
create index tax_cases_client_year_idx on public.tax_cases(client_id, tax_year desc);
create index tax_cases_status_idx on public.tax_cases(status);
create index tax_cases_preparer_idx on public.tax_cases(assigned_preparer_id);
create index tax_jurisdictions_case_idx on public.tax_jurisdictions(tax_case_id);
create index tax_amounts_case_idx on public.tax_amounts(tax_case_id);
create index tax_amounts_jurisdiction_idx on public.tax_amounts(jurisdiction_id);
create index notes_client_created_idx on public.notes(client_id, created_at desc);
create index notes_case_created_idx on public.notes(tax_case_id, created_at desc);
create index activities_client_created_idx on public.activities(client_id, created_at desc);
create index activities_case_created_idx on public.activities(tax_case_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), new.email, 'New staff member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.enforce_business_client_type()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.clients
    where id = new.client_id and client_type = 'business'
  ) then
    raise exception 'businesses.client_id must reference a business client';
  end if;
  return new;
end;
$$;

create trigger businesses_enforce_client_type
before insert or update of client_id on public.businesses
for each row execute function public.enforce_business_client_type();

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients
for each row execute function public.set_updated_at();
create trigger businesses_set_updated_at before update on public.businesses
for each row execute function public.set_updated_at();
create trigger business_partners_set_updated_at before update on public.business_partners
for each row execute function public.set_updated_at();
create trigger tax_cases_set_updated_at before update on public.tax_cases
for each row execute function public.set_updated_at();
create trigger tax_jurisdictions_set_updated_at before update on public.tax_jurisdictions
for each row execute function public.set_updated_at();
create trigger tax_amounts_set_updated_at before update on public.tax_amounts
for each row execute function public.set_updated_at();
create trigger notes_set_updated_at before update on public.notes
for each row execute function public.set_updated_at();

-- Activities are append-only: updated_at exists for a consistent audit shape,
-- but authenticated users receive no UPDATE or DELETE policy.

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and status = 'active'
      and role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_active_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_active_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.businesses enable row level security;
alter table public.business_partners enable row level security;
alter table public.tax_cases enable row level security;
alter table public.tax_jurisdictions enable row level security;
alter table public.tax_amounts enable row level security;
alter table public.notes enable row level security;
alter table public.activities enable row level security;

create policy profiles_select_staff on public.profiles for select to authenticated
using (public.is_active_staff());
create policy profiles_update_self_or_admin on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.is_admin())
with check (id = (select auth.uid()) or public.is_admin());

create policy clients_select_staff on public.clients for select to authenticated
using (public.is_active_staff());
create policy clients_insert_staff on public.clients for insert to authenticated
with check (public.is_active_staff());
create policy clients_update_staff on public.clients for update to authenticated
using (public.is_active_staff()) with check (public.is_active_staff());
create policy clients_delete_admin on public.clients for delete to authenticated
using (public.is_admin());

create policy businesses_select_staff on public.businesses for select to authenticated using (public.is_active_staff());
create policy businesses_insert_staff on public.businesses for insert to authenticated with check (public.is_active_staff());
create policy businesses_update_staff on public.businesses for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy businesses_delete_admin on public.businesses for delete to authenticated using (public.is_admin());

create policy partners_select_staff on public.business_partners for select to authenticated using (public.is_active_staff());
create policy partners_insert_staff on public.business_partners for insert to authenticated with check (public.is_active_staff());
create policy partners_update_staff on public.business_partners for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy partners_delete_admin on public.business_partners for delete to authenticated using (public.is_admin());

create policy cases_select_staff on public.tax_cases for select to authenticated using (public.is_active_staff());
create policy cases_insert_staff on public.tax_cases for insert to authenticated with check (public.is_active_staff());
create policy cases_update_staff on public.tax_cases for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy cases_delete_admin on public.tax_cases for delete to authenticated using (public.is_admin());

create policy jurisdictions_select_staff on public.tax_jurisdictions for select to authenticated using (public.is_active_staff());
create policy jurisdictions_insert_staff on public.tax_jurisdictions for insert to authenticated with check (public.is_active_staff());
create policy jurisdictions_update_staff on public.tax_jurisdictions for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy jurisdictions_delete_staff on public.tax_jurisdictions for delete to authenticated using (public.is_active_staff());

create policy amounts_select_staff on public.tax_amounts for select to authenticated using (public.is_active_staff());
create policy amounts_insert_staff on public.tax_amounts for insert to authenticated with check (public.is_active_staff());
create policy amounts_update_staff on public.tax_amounts for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());
create policy amounts_delete_staff on public.tax_amounts for delete to authenticated using (public.is_active_staff());

create policy notes_select_staff on public.notes for select to authenticated using (public.is_active_staff());
create policy notes_insert_staff on public.notes for insert to authenticated with check (public.is_active_staff());
create policy notes_update_author_or_admin on public.notes for update to authenticated
using (author_id = (select auth.uid()) or public.is_admin())
with check (author_id = (select auth.uid()) or public.is_admin());
create policy notes_delete_author_or_admin on public.notes for delete to authenticated
using (author_id = (select auth.uid()) or public.is_admin());

create policy activities_select_staff on public.activities for select to authenticated using (public.is_active_staff());
create policy activities_insert_staff on public.activities for insert to authenticated with check (public.is_active_staff());

grant select, insert, update, delete on public.clients, public.businesses,
  public.business_partners, public.tax_cases, public.tax_jurisdictions,
  public.tax_amounts, public.notes to authenticated;
grant select, insert on public.activities to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;
