-- =============================================================================
-- FreightFlow — 0004: Dispatch tables (load_requests, loads, load_status_history)
-- =============================================================================
-- The dispatch lifecycle:
--   load_requests  → inbound opportunities (from brokers/shippers) being triaged
--   loads          → committed shipments dispatched to a truck/driver/trailer
--   load_status_history → immutable audit trail of load status transitions
--
-- Schema only. No dispatch business logic is implemented here.
-- =============================================================================

-- --- load_requests -----------------------------------------------------------
create table public.load_requests (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  created_by          uuid references public.users (id) on delete set null,
  status              public.load_request_status not null default 'new',
  reference_number    text,                      -- broker/shipper reference

  -- Shipper / broker
  broker_name         text,
  broker_contact      text,
  broker_phone        text,
  broker_email        extensions.citext,

  -- Origin
  origin_city         text,
  origin_state        text,
  origin_postal_code  text,
  pickup_date         date,

  -- Destination
  dest_city           text,
  dest_state          text,
  dest_postal_code    text,
  delivery_date       date,

  -- Freight detail
  commodity           text,
  weight_lbs          int,
  distance_miles      int,
  equipment_type      public.trailer_type,
  offered_rate        numeric(12, 2),            -- USD
  quoted_rate         numeric(12, 2),            -- USD
  notes               text,
  expires_at          timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint load_requests_rate_positive
    check (offered_rate is null or offered_rate >= 0)
);

comment on table public.load_requests is 'Inbound load opportunities being triaged before commitment.';

create index idx_load_requests_company_id on public.load_requests (company_id);
create index idx_load_requests_status on public.load_requests (status);
create index idx_load_requests_pickup_date on public.load_requests (pickup_date);
create index idx_load_requests_created_by on public.load_requests (created_by);

create trigger trg_load_requests_updated_at
  before update on public.load_requests
  for each row execute function public.set_updated_at();

-- --- loads -------------------------------------------------------------------
create table public.loads (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  load_request_id     uuid references public.load_requests (id) on delete set null,
  load_number         text not null,             -- company-facing load id
  status              public.load_status not null default 'draft',

  -- Assignment
  driver_id           uuid references public.users (id) on delete set null,
  truck_id            uuid references public.trucks (id) on delete set null,
  trailer_id          uuid references public.trailers (id) on delete set null,
  dispatched_by       uuid references public.users (id) on delete set null,

  -- Customer / broker
  broker_name         text,
  reference_number    text,

  -- Origin
  origin_city         text,
  origin_state        text,
  origin_postal_code  text,
  pickup_date         date,
  pickup_window_start timestamptz,
  pickup_window_end   timestamptz,

  -- Destination
  dest_city           text,
  dest_state          text,
  dest_postal_code    text,
  delivery_date       date,
  delivery_window_start timestamptz,
  delivery_window_end   timestamptz,

  -- Freight + financials
  commodity           text,
  weight_lbs          int,
  distance_miles      int,
  rate                numeric(12, 2),            -- agreed line-haul rate (USD)
  currency            text not null default 'USD',
  notes               text,

  dispatched_at       timestamptz,
  delivered_at        timestamptz,
  completed_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint loads_number_unique_per_company unique (company_id, load_number),
  constraint loads_rate_positive check (rate is null or rate >= 0)
);

comment on table public.loads is 'Committed shipments dispatched against company equipment/drivers.';

create index idx_loads_company_id on public.loads (company_id);
create index idx_loads_status on public.loads (status);
create index idx_loads_driver_id on public.loads (driver_id);
create index idx_loads_truck_id on public.loads (truck_id);
create index idx_loads_trailer_id on public.loads (trailer_id);
create index idx_loads_pickup_date on public.loads (pickup_date);
create index idx_loads_load_request_id on public.loads (load_request_id);

create trigger trg_loads_updated_at
  before update on public.loads
  for each row execute function public.set_updated_at();

-- --- load_status_history -----------------------------------------------------
-- Append-only audit trail. Rows are inserted on each status transition.
create table public.load_status_history (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  load_id         uuid not null references public.loads (id) on delete cascade,
  changed_by      uuid references public.users (id) on delete set null,
  from_status     public.load_status,
  to_status       public.load_status not null,
  note            text,
  created_at      timestamptz not null default now()
);

comment on table public.load_status_history is 'Immutable audit trail of load status transitions.';

create index idx_load_status_history_load_id on public.load_status_history (load_id);
create index idx_load_status_history_company_id on public.load_status_history (company_id);
create index idx_load_status_history_created_at on public.load_status_history (created_at);
