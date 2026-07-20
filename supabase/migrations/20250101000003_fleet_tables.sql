-- =============================================================================
-- FreightFlow — 0003: Fleet tables (trucks, trailers)
-- =============================================================================
-- Equipment owned/operated by a company. Trucks may be assigned a default
-- driver; trailers are independent units linked to loads at dispatch time.
-- =============================================================================

-- --- trucks ------------------------------------------------------------------
create table public.trucks (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  assigned_driver_id  uuid references public.users (id) on delete set null,
  unit_number         text not null,             -- fleet-facing identifier
  make                text,
  model               text,
  year                int,
  vin                 text,                      -- Vehicle Identification Number
  license_plate       text,
  license_state       text,
  color               text,
  status              public.equipment_status not null default 'active',
  odometer            int,                       -- miles
  fuel_capacity_gal   numeric(6, 2),
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint trucks_year_valid check (year is null or (year between 1900 and 2100)),
  constraint trucks_unit_unique_per_company unique (company_id, unit_number)
);

comment on table public.trucks is 'Power units (tractors) operated by a company.';

create index idx_trucks_company_id on public.trucks (company_id);
create index idx_trucks_assigned_driver_id on public.trucks (assigned_driver_id);
create index idx_trucks_status on public.trucks (status);
create unique index uq_trucks_vin on public.trucks (vin) where vin is not null;

create trigger trg_trucks_updated_at
  before update on public.trucks
  for each row execute function public.set_updated_at();

-- --- trailers ----------------------------------------------------------------
create table public.trailers (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  unit_number         text not null,
  type                public.trailer_type not null default 'dry_van',
  make                text,
  model               text,
  year                int,
  vin                 text,
  license_plate       text,
  license_state       text,
  length_ft           numeric(5, 2),
  capacity_lbs        int,
  status              public.equipment_status not null default 'active',
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint trailers_year_valid check (year is null or (year between 1900 and 2100)),
  constraint trailers_unit_unique_per_company unique (company_id, unit_number)
);

comment on table public.trailers is 'Trailer equipment operated by a company.';

create index idx_trailers_company_id on public.trailers (company_id);
create index idx_trailers_type on public.trailers (type);
create index idx_trailers_status on public.trailers (status);
create unique index uq_trailers_vin on public.trailers (vin) where vin is not null;

create trigger trg_trailers_updated_at
  before update on public.trailers
  for each row execute function public.set_updated_at();
