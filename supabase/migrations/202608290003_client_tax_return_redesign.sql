-- CRM EMY: Migration for Individual Client & Multi-Year Tax Return Redesign
-- Decouples permanent client identity from yearly tax return engagements.
-- Adds historical filing snapshot fields to preserve historical accuracy.

create extension if not exists pgcrypto;

-- 1. Ensure tax_returns table (or enhanced tax_cases) has snapshot columns
create table if not exists public.tax_returns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_year smallint not null check (tax_year between 1900 and 2200),
  return_type text not null default '1040',
  filing_status text not null default 'Single',
  status public.tax_case_status not null default 'new',
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  federal_tax_amount numeric(14,2) not null default 0,
  preparation_fee numeric(12,2) not null default 0 check (preparation_fee >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance numeric(12,2) generated always as (greatest(0, preparation_fee - amount_paid)) stored,
  internal_notes text,

  -- Historical Filing Snapshot Fields
  taxpayer_name_snapshot text,
  address_snapshot text,
  filing_status_snapshot text,
  spouse_snapshot jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_client_yearly_return unique (client_id, tax_year, return_type)
);

-- Index for quick lookup of client tax returns ordered by year
create index if not exists idx_tax_returns_client_year on public.tax_returns(client_id, tax_year desc);
create index if not exists idx_tax_returns_status on public.tax_returns(status);
create index if not exists idx_tax_returns_assigned_staff on public.tax_returns(assigned_staff_id);

-- 2. Trigger to automatically populate snapshots if not provided on insert
create or replace function public.fn_populate_tax_return_snapshot()
returns trigger as $$
declare
  v_client record;
begin
  select first_name, last_name, display_name, address_line_1, city, state, zip_code
  into v_client
  from public.clients
  where id = new.client_id;

  if found then
    if new.taxpayer_name_snapshot is null then
      new.taxpayer_name_snapshot := coalesce(v_client.display_name, trim(concat(v_client.first_name, ' ', v_client.last_name)));
    end if;

    if new.address_snapshot is null then
      new.address_snapshot := concat_ws(', ', nullif(v_client.address_line_1, ''), nullif(v_client.city, ''), nullif(v_client.state, ''), nullif(v_client.zip_code, ''));
    end if;

    if new.filing_status_snapshot is null then
      new.filing_status_snapshot := new.filing_status;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_populate_tax_return_snapshot on public.tax_returns;
create trigger trg_populate_tax_return_snapshot
  before insert on public.tax_returns
  for each row
  execute function public.fn_populate_tax_return_snapshot();

-- 3. Migration helper to sync any existing tax_cases into tax_returns without data loss
insert into public.tax_returns (
  id,
  client_id,
  tax_year,
  return_type,
  status,
  assigned_staff_id,
  preparation_fee,
  created_at,
  updated_at
)
select
  tc.id,
  tc.client_id,
  tc.tax_year,
  coalesce(tc.return_type, '1040'),
  tc.status,
  tc.assigned_preparer_id,
  tc.preparation_fee,
  tc.created_at,
  tc.updated_at
from public.tax_cases tc
on conflict (id) do nothing;
