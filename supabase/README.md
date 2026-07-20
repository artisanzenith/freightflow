# supabase

Backend source of truth: schema migrations, Edge Functions, RLS policies, and seed data.

**Status:** Not implemented yet (Phase 1 provisions Supabase).

## Structure

- `migrations/` — timestamped SQL migrations (the schema source of truth; no manual dashboard edits)
- `functions/` — Edge Functions (Deno): invoice PDF generation, webhooks, push notifications, integrations
- `policies/` — RLS policy definitions (default-deny, tenant isolation by `company_id`)
- `seed/` — demo data for local/dev (sample company, users, loads)

See [`../docs/Database Plan.md`](../docs/Database%20Plan.md) for the data model and RLS strategy.
