-- =============================================================================
-- FreightFlow — 0005: Document tables (document_categories, documents)
-- =============================================================================
-- Documents (rate confirmations, BOLs, PODs, insurance, permits, receipts) are
-- stored as objects in the `documents` storage bucket. These tables hold the
-- metadata and link each file to its owning entity.
-- =============================================================================

-- --- document_categories -----------------------------------------------------
-- Categories are per-company so tenants can tailor their own taxonomy, while a
-- set of system defaults can be seeded with company_id = null (global).
create table public.document_categories (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid references public.companies (id) on delete cascade,
  name            text not null,
  slug            text not null,
  description     text,
  is_system       boolean not null default false,   -- seeded global category
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint document_categories_name_not_blank check (length(trim(name)) > 0)
);

comment on table public.document_categories is 'Taxonomy for documents; per-company with optional global defaults.';

-- Unique slug per company; global (null company) slugs unique among themselves.
create unique index uq_doc_categories_company_slug
  on public.document_categories (company_id, slug)
  where company_id is not null;
create unique index uq_doc_categories_global_slug
  on public.document_categories (slug)
  where company_id is null;
create index idx_doc_categories_company_id on public.document_categories (company_id);

create trigger trg_doc_categories_updated_at
  before update on public.document_categories
  for each row execute function public.set_updated_at();

-- --- documents ---------------------------------------------------------------
-- Polymorphic association: a document may attach to a load, truck, trailer,
-- user/profile, or stand alone. We use nullable typed FKs (not a generic
-- entity_id) to keep referential integrity and cascade behavior explicit.
create table public.documents (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  category_id     uuid references public.document_categories (id) on delete set null,
  uploaded_by     uuid references public.users (id) on delete set null,

  -- Optional owning entities (at most one is typically set).
  load_id         uuid references public.loads (id) on delete cascade,
  truck_id        uuid references public.trucks (id) on delete cascade,
  trailer_id      uuid references public.trailers (id) on delete cascade,
  user_id         uuid references public.users (id) on delete cascade,

  -- Storage object metadata (bucket = 'documents').
  storage_path    text not null,                 -- object path within bucket
  file_name       text not null,
  mime_type       text,
  file_size_bytes bigint,
  title           text,
  description     text,
  expires_at      date,                          -- e.g. insurance/permit expiry
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint documents_size_positive
    check (file_size_bytes is null or file_size_bytes >= 0)
);

comment on table public.documents is 'File metadata for objects stored in the documents bucket.';

create index idx_documents_company_id on public.documents (company_id);
create index idx_documents_category_id on public.documents (category_id);
create index idx_documents_load_id on public.documents (load_id);
create index idx_documents_truck_id on public.documents (truck_id);
create index idx_documents_trailer_id on public.documents (trailer_id);
create index idx_documents_user_id on public.documents (user_id);
create index idx_documents_expires_at on public.documents (expires_at);

create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();
