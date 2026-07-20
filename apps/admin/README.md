# apps/admin

Next.js (App Router) + TypeScript + Tailwind admin portal for **dispatchers, owners, and billing**.

**Status:** Not implemented yet (Phase 1 will scaffold Next.js here).

## Responsibilities

- Load board, driver/truck/customer management
- Invoicing & reporting
- Compliance tracking
- Company setup & team management

## Will consume

- `@freightflow/shared` — types & enums
- `@freightflow/validation` — Zod schemas
- `@freightflow/api` — Supabase data access
- `@freightflow/ui` — shared design tokens

See [`../../docs/UI Flow.md`](../../docs/UI%20Flow.md) and [`../../docs/Architecture.md`](../../docs/Architecture.md).
