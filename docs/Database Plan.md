# Database Plan

**Product:** FreightFlow
**Backend:** Supabase (PostgreSQL)
**Version:** 0.1 (Foundation)
**Status:** Draft

This document describes the data model, relationships, and Row-Level Security (RLS) strategy. It is the conceptual source of truth; the physical source of truth will be SQL migrations in `supabase/migrations`.

---

## 1. Design Principles

- **Multi-tenant by `company_id`.** Every tenant-scoped table carries `company_id` and is protected by RLS.
- **UUID primary keys** (`uuid` default `gen_random_uuid()`).
- **Audit columns** on mutable tables: `created_at`, `updated_at`, `created_by`.
- **Enums** for constrained states (status, roles) — implemented as Postgres enums or lookup tables.
- **Append-only history** for load status changes (auditability).
- **Soft deletes** where recovery matters (`deleted_at` nullable) instead of hard deletes.
- **Money** stored as `numeric(12,2)` in USD; never floats.
- **Timestamps** in `timestamptz` (UTC).

---

## 2. Core Entities (ER Overview)

```
companies 1───∞ profiles ∞───1 auth.users
    │
    ├───∞ drivers
    ├───∞ trucks
    ├───∞ customers
    ├───∞ loads ───∞ load_status_history
    │        │
    │        ├───∞ documents
    │        └───1 invoices ───∞ invoice_line_items
    └───∞ compliance_records
```

---

## 3. Tables

### 3.1 companies (tenant root)

| Column                  | Type        | Notes                  |
| ----------------------- | ----------- | ---------------------- |
| id                      | uuid PK     |                        |
| name                    | text        | Carrier legal/DBA name |
| mc_number               | text        | Motor Carrier number   |
| dot_number              | text        | USDOT number           |
| phone                   | text        |                        |
| address                 | jsonb       | Structured US address  |
| created_at / updated_at | timestamptz |                        |

### 3.2 profiles (user ↔ company ↔ role)

| Column                  | Type                                          | Notes             |
| ----------------------- | --------------------------------------------- | ----------------- |
| id                      | uuid PK                                       | = `auth.users.id` |
| company_id              | uuid FK → companies                           |                   |
| full_name               | text                                          |                   |
| role                    | enum(`owner`,`dispatcher`,`driver`,`billing`) |                   |
| phone                   | text                                          |                   |
| status                  | enum(`active`,`invited`,`disabled`)           |                   |
| created_at / updated_at | timestamptz                                   |                   |

### 3.3 drivers

| Column                               | Type                          | Notes                             |
| ------------------------------------ | ----------------------------- | --------------------------------- |
| id                                   | uuid PK                       |                                   |
| company_id                           | uuid FK                       |                                   |
| profile_id                           | uuid FK → profiles (nullable) | linked once driver accepts invite |
| full_name                            | text                          |                                   |
| phone                                | text                          |                                   |
| license_number                       | text                          |                                   |
| license_expiry                       | date                          |                                   |
| medical_card_expiry                  | date                          |                                   |
| status                               | enum(`active`,`inactive`)     |                                   |
| created_at / updated_at / created_by |                               |                                   |

### 3.4 trucks

| Column              | Type                                    | Notes |
| ------------------- | --------------------------------------- | ----- |
| id                  | uuid PK                                 |       |
| company_id          | uuid FK                                 |       |
| unit_number         | text                                    |       |
| make / model / year | text/int                                |       |
| vin                 | text                                    |       |
| plate               | text                                    |       |
| status              | enum(`active`,`maintenance`,`inactive`) |       |

### 3.5 customers (brokers/shippers)

| Column                                       | Type                     | Notes |
| -------------------------------------------- | ------------------------ | ----- |
| id                                           | uuid PK                  |       |
| company_id                                   | uuid FK                  |       |
| name                                         | text                     |       |
| type                                         | enum(`broker`,`shipper`) |       |
| mc_number                                    | text                     |       |
| contact_name / contact_email / contact_phone | text                     |       |
| credit_notes                                 | text                     |       |
| created_at / updated_at                      |                          |       |

### 3.6 loads (central entity)

| Column                               | Type                         | Notes                 |
| ------------------------------------ | ---------------------------- | --------------------- |
| id                                   | uuid PK                      |                       |
| company_id                           | uuid FK                      |                       |
| reference_number                     | text                         | Human-friendly load # |
| customer_id                          | uuid FK → customers          |                       |
| assigned_driver_id                   | uuid FK → drivers (nullable) |                       |
| assigned_truck_id                    | uuid FK → trucks (nullable)  |                       |
| origin                               | jsonb                        | address + geo         |
| destination                          | jsonb                        | address + geo         |
| pickup_window_start / end            | timestamptz                  |                       |
| delivery_window_start / end          | timestamptz                  |                       |
| commodity                            | text                         |                       |
| weight_lbs                           | numeric                      |                       |
| rate                                 | numeric(12,2)                | agreed line-haul rate |
| status                               | enum (see 4)                 |                       |
| notes                                | text                         |                       |
| created_at / updated_at / created_by |                              |                       |
| deleted_at                           | timestamptz (nullable)       | soft delete           |

### 3.7 load_status_history (append-only)

| Column      | Type               | Notes        |
| ----------- | ------------------ | ------------ |
| id          | uuid PK            |              |
| company_id  | uuid FK            |              |
| load_id     | uuid FK → loads    |              |
| from_status | text               |              |
| to_status   | text               |              |
| changed_by  | uuid FK → profiles |              |
| location    | jsonb (nullable)   | check-in geo |
| created_at  | timestamptz        |              |

### 3.8 documents

| Column       | Type                                          | Notes                  |
| ------------ | --------------------------------------------- | ---------------------- |
| id           | uuid PK                                       |                        |
| company_id   | uuid FK                                       |                        |
| load_id      | uuid FK → loads (nullable)                    |                        |
| type         | enum(`rate_confirmation`,`bol`,`pod`,`other`) |                        |
| storage_path | text                                          | path in Storage bucket |
| file_name    | text                                          |                        |
| uploaded_by  | uuid FK → profiles                            |                        |
| created_at   | timestamptz                                   |                        |

### 3.9 invoices

| Column                       | Type                                         | Notes         |
| ---------------------------- | -------------------------------------------- | ------------- |
| id                           | uuid PK                                      |               |
| company_id                   | uuid FK                                      |               |
| load_id                      | uuid FK → loads                              |               |
| customer_id                  | uuid FK → customers                          |               |
| invoice_number               | text                                         |               |
| status                       | enum(`draft`,`sent`,`paid`,`overdue`,`void`) |               |
| subtotal / total             | numeric(12,2)                                |               |
| issued_at / due_at / paid_at | timestamptz                                  |               |
| pdf_storage_path             | text (nullable)                              | generated PDF |
| created_at / updated_at      |                                              |               |

### 3.10 invoice_line_items

| Column      | Type               | Notes                              |
| ----------- | ------------------ | ---------------------------------- |
| id          | uuid PK            |                                    |
| invoice_id  | uuid FK → invoices |                                    |
| description | text               |                                    |
| amount      | numeric(12,2)      | line-haul, detention, lumper, etc. |

### 3.11 compliance_records

| Column                | Type                                         | Notes          |
| --------------------- | -------------------------------------------- | -------------- |
| id                    | uuid PK                                      |                |
| company_id            | uuid FK                                      |                |
| type                  | enum(`authority`,`insurance`,`ifta`,`other`) |                |
| reference             | text                                         | policy #, etc. |
| valid_from / valid_to | date                                         |                |
| document_id           | uuid FK → documents (nullable)               |                |

---

## 4. Load Status Lifecycle

```
draft → available → dispatched → accepted → at_pickup → loaded
   → in_transit → at_delivery → delivered → invoiced → paid
```

Terminal/branch states: `cancelled`, `declined` (driver declines assignment → back to `available`).

- Every transition writes a `load_status_history` row.
- Allowed transitions enforced in the API/validation layer (and optionally a DB trigger).

---

## 5. RLS Strategy

**Principle:** Default-deny. Enable RLS on every table; add explicit policies.

Core helper (conceptual): a user's company is derived from their `profiles` row.

```sql
-- Example policy pattern (conceptual, not final)
alter table loads enable row level security;

create policy "tenant_read"
  on loads for select
  using (company_id = (select company_id from profiles where id = auth.uid()));

create policy "tenant_write"
  on loads for insert with check (
    company_id = (select company_id from profiles where id = auth.uid())
  );
```

**Role-based nuance:**

- `driver`: can read loads assigned to them; can update status of their own loads; can upload documents.
- `dispatcher`/`owner`: full read/write within their company.
- `billing`: read loads/customers; full write on invoices.

Role checks combine `company_id` isolation with a role predicate from `profiles.role`.

## 6. Storage (Documents)

- Private bucket `documents`.
- Path convention: `{company_id}/{load_id}/{document_id}-{filename}`.
- Access via short-lived signed URLs generated server-side.
- Storage RLS policies mirror table tenancy (path prefix = company_id).

## 7. Indexing Plan (initial)

- `loads (company_id, status)`
- `loads (company_id, pickup_window_start)`
- `loads (assigned_driver_id)`
- `load_status_history (load_id, created_at)`
- `invoices (company_id, status, due_at)`
- `documents (load_id)`

## 8. Migrations & Seeding

- All schema changes via `supabase/migrations` (timestamped SQL files).
- No manual dashboard edits in staging/production.
- `supabase/seed` provides demo company, users, and sample loads for local/dev.

## 9. Data Integrity Rules

- FKs enforced with appropriate `on delete` behavior (restrict for referenced core records; cascade for children like line items/history).
- Money always `numeric`, never `float`.
- Enums constrain status/role values at the DB level.
- `updated_at` maintained via trigger.
