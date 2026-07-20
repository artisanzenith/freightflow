-- =============================================================================
-- FreightFlow — 0007: Finance & settings tables (expenses, revenue, settings)
-- =============================================================================
-- expenses  → money out (fuel, maintenance, tolls, ...), optionally tied to a
--             load / truck / driver for profitability analysis
-- revenue   → money in (line-haul, accessorials, ...), typically tied to a load
-- settings  → per-company key/value configuration store
--
-- Schema only. No accounting logic is implemented here.
-- =============================================================================

-- --- expenses ----------------------------------------------------------------
create table public.expenses (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  created_by      uuid references public.users (id) on delete set null,

  -- Optional attribution for cost analysis.
  load_id         uuid references public.loads (id) on delete set null,
  truck_id        uuid references public.trucks (id) on delete set null,
  driver_id       uuid references public.users (id) on delete set null,
  document_id     uuid references public.documents (id) on delete set null,   -- receipt

  category        public.expense_category not null default 'other',
  status          public.payment_status not null default 'pending',
  description     text,
  vendor          text,
  amount          numeric(12, 2) not null,
  currency        text not null default 'USD',
  quantity        numeric(10, 2),                -- e.g. gallons of fuel
  unit_price      numeric(12, 4),
  incurred_on     date not null default current_date,
  paid_on         date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint expenses_amount_positive check (amount >= 0)
);

comment on table public.expenses is 'Money out; optionally attributed to a load/truck/driver.';

create index idx_expenses_company_id on public.expenses (company_id);
create index idx_expenses_load_id on public.expenses (load_id);
create index idx_expenses_truck_id on public.expenses (truck_id);
create index idx_expenses_driver_id on public.expenses (driver_id);
create index idx_expenses_category on public.expenses (category);
create index idx_expenses_status on public.expenses (status);
create index idx_expenses_incurred_on on public.expenses (incurred_on);

create trigger trg_expenses_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

-- --- revenue -----------------------------------------------------------------
create table public.revenue (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  created_by      uuid references public.users (id) on delete set null,

  load_id         uuid references public.loads (id) on delete set null,
  document_id     uuid references public.documents (id) on delete set null,   -- invoice

  status          public.payment_status not null default 'pending',
  description     text,
  payer           text,                          -- broker / shipper
  invoice_number  text,
  amount          numeric(12, 2) not null,
  currency        text not null default 'USD',
  earned_on       date not null default current_date,
  invoiced_on     date,
  paid_on         date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint revenue_amount_positive check (amount >= 0)
);

comment on table public.revenue is 'Money in; typically attributed to a load.';

create index idx_revenue_company_id on public.revenue (company_id);
create index idx_revenue_load_id on public.revenue (load_id);
create index idx_revenue_status on public.revenue (status);
create index idx_revenue_earned_on on public.revenue (earned_on);

create trigger trg_revenue_updated_at
  before update on public.revenue
  for each row execute function public.set_updated_at();

-- --- settings ----------------------------------------------------------------
-- Per-company configuration store. One row per (company, key). Values are
-- JSONB to accommodate scalars, arrays, and nested objects.
create table public.settings (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  key             text not null,
  value           jsonb not null default '{}'::jsonb,
  description     text,
  updated_by      uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint settings_key_unique_per_company unique (company_id, key),
  constraint settings_key_not_blank check (length(trim(key)) > 0)
);

comment on table public.settings is 'Per-company key/value configuration store.';

create index idx_settings_company_id on public.settings (company_id);

create trigger trg_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();
