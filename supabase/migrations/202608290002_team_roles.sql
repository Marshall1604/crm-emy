-- CRM EMY team roles and database-backed staff directory.
-- Application authorization remains in PostgreSQL, never frontend state.

alter type public.staff_role rename value 'owner' to 'super_admin';
alter type public.staff_role rename value 'preparer' to 'tax_preparer';
alter type public.staff_role add value 'reviewer';
alter type public.staff_role add value 'staff';

alter table public.profiles
  add column email text,
  add column last_active_at timestamptz;

update public.profiles as profile
set email = auth_user.email,
    last_active_at = auth_user.last_sign_in_at
from auth.users as auth_user
where auth_user.id = profile.id;

create unique index profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, last_active_at)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), new.email, 'New staff member'),
    new.email,
    new.last_sign_in_at
  );
  return new;
end;
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
      and role in ('super_admin', 'admin')
  );
$$;

create view public.team_members
with (security_invoker = true)
as
select
  profile.id,
  profile.full_name,
  profile.email,
  profile.avatar_url,
  profile.role,
  profile.status,
  count(tax_case.id)::integer as assigned_returns,
  profile.last_active_at,
  profile.created_at,
  profile.updated_at
from public.profiles as profile
left join public.tax_cases as tax_case
  on tax_case.assigned_preparer_id = profile.id
group by profile.id;

grant select on public.team_members to authenticated;

comment on view public.team_members is
  'Database-backed CRM staff directory joined to assigned tax returns; protected by profiles and tax_cases RLS.';
