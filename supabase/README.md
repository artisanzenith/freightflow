# supabase

Backend source of truth: schema migrations, Row Level Security, storage buckets, and seed data.

**Status:** Backend foundation implemented and applied. No application features yet.

## Structure

- `config.toml` — Supabase CLI project config (API, DB, Auth, Storage)
- `migrations/` — timestamped SQL migrations (the schema source of truth; no manual dashboard edits)
- `functions/` — Edge Functions (Deno): reserved for later phases
- `policies/` — reserved (policies currently live inline with the RLS migration)
- `seed/` — reserved for local/dev demo data

## Migrations

Applied in order:

| File                               | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| `0001_init_extensions_enums.sql`   | Extensions (pgcrypto, uuid-ossp, citext), enums, `set_updated_at` |
| `0002_core_tenant_tables.sql`      | `companies`, `users`, `profiles` + auth bootstrap trigger         |
| `0003_fleet_tables.sql`            | `trucks`, `trailers`                                              |
| `0004_dispatch_tables.sql`         | `load_requests`, `loads`, `load_status_history`                   |
| `0005_document_tables.sql`         | `document_categories`, `documents`                                |
| `0006_communication_tables.sql`    | `messages`, `notifications`                                       |
| `0007_finance_settings_tables.sql` | `expenses`, `revenue`, `settings`                                 |
| `0008_row_level_security.sql`      | RLS helper functions, enable RLS, and policies for all 15 tables  |
| `0009_storage_buckets.sql`         | `documents` + `profile-images` buckets and their storage policies |
| `0010_seed_reference_data.sql`     | Global (system) document categories                               |

## Data model

Multi-tenant: **`companies`** is the tenant boundary. Every user belongs to one
company and carries a role (`owner`, `dispatcher`, `driver`, `accountant`,
`admin`). `public.users` extends `auth.users` 1:1; a trigger mirrors new auth
users into `public.users` on signup.

## Security model (RLS)

- RLS is enabled on all 15 public tables.
- Tenant isolation: rows are scoped by `company_id`, compared against the
  caller's company via `public.current_company_id()`.
- Reads: any authenticated company member. Writes: managers
  (`owner`/`dispatcher`/`admin`) by default; owners of a record can manage their
  own rows (profile, notifications, documents they uploaded, messages they sent);
  finance tables also allow `accountant`.
- `load_status_history` is append-only (insert + select; no update/delete).
- The `service_role` key bypasses RLS for trusted server-side jobs.

Helper functions (SECURITY DEFINER): `current_company_id()`,
`current_user_role()`, `is_company_member()`, `is_company_manager()`,
`is_platform_admin()`, and `storage_company_id()` for storage path checks.

## Storage buckets

Both private; access enforced by RLS on `storage.objects`. Paths are
tenant-scoped by convention:

- `documents/<company_id>/<entity>/<object>` — 50 MiB limit, PDF/images/office docs
- `profile-images/<company_id>/<user_id>/<object>` — 5 MiB limit, images only

## Working with the schema

```bash
# Link once (requires SUPABASE_ACCESS_TOKEN and the DB password)
supabase link --project-ref <project-ref>

# Apply migrations to the linked project
supabase db push

# Regenerate canonical TypeScript types into packages/shared
pnpm --filter @freightflow/shared gen:types
```

Reusable, hand-authored row types live in
[`../packages/shared/src/database.types.ts`](../packages/shared/src/database.types.ts).

See [`../docs/Database Plan.md`](../docs/Database%20Plan.md) for the broader data-model rationale.
