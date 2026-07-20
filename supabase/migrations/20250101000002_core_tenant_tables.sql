-- =============================================================================
-- FreightFlow — 0002: Core tenant tables (companies, users, profiles)
-- =============================================================================
-- Multi-tenant model: a company is the tenant boundary. Every user belongs to
-- exactly one company. `users` extends Supabase's auth.users 1:1 and carries
-- the tenant + role. `profiles` holds non-auth personal detail.
-- =============================================================================

-- --- companies ---------------------------------------------------------------
create table public.companies (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  legal_name      text,
  type            public.company_type not null default 'owner_operator',
  mc_number       text,                          -- FMCSA Motor Carrier number
  dot_number      text,                          -- USDOT number
  ein             text,                          -- Employer Identification Number
  email           extensions.citext,
  phone           text,
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,                          -- USA 2-letter state
  postal_code     text,
  country         text not null default 'US',
  timezone        text not null default 'America/Chicago',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint companies_name_not_blank check (length(trim(name)) > 0)
);

comment on table public.companies is 'Tenant boundary: an owner-operator or trucking company.';

create index idx_companies_type on public.companies (type);
create index idx_companies_is_active on public.companies (is_active);

create trigger trg_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- --- users -------------------------------------------------------------------
-- 1:1 extension of auth.users. id == auth.users.id.
create table public.users (
  id              uuid primary key references auth.users (id) on delete cascade,
  company_id      uuid references public.companies (id) on delete set null,
  email           extensions.citext not null unique,
  role            public.user_role not null default 'owner',
  status          public.user_status not null default 'invited',
  full_name       text,
  phone           text,
  last_seen_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.users is 'Application user; extends auth.users 1:1 with tenant and role.';

create index idx_users_company_id on public.users (company_id);
create index idx_users_role on public.users (role);
create index idx_users_status on public.users (status);

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- --- profiles ----------------------------------------------------------------
-- Extended personal detail for a user (1:1). Separated from `users` so auth /
-- tenant data stays lean and hot.
create table public.profiles (
  id                  uuid primary key references public.users (id) on delete cascade,
  company_id          uuid not null references public.companies (id) on delete cascade,
  first_name          text,
  last_name           text,
  display_name        text,
  avatar_path         text,                      -- storage object path in profile-images
  bio                 text,
  date_of_birth       date,
  cdl_number          text,                      -- Commercial Driver's License
  cdl_state           text,
  cdl_expiry          date,
  emergency_contact   text,
  emergency_phone     text,
  address_line1       text,
  address_line2       text,
  city                text,
  state               text,
  postal_code         text,
  country             text not null default 'US',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.profiles is 'Extended personal detail for a user (1:1 with users).';

create index idx_profiles_company_id on public.profiles (company_id);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- --- auth bootstrap trigger --------------------------------------------------
-- When a new auth user is created, mirror a minimal row into public.users so
-- the rest of the app can reference it. Company assignment happens in app logic
-- (invite/onboarding); here we only capture identity.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'owner'),
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
