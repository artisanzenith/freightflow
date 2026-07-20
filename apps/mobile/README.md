# apps/mobile

React Native + Expo (TypeScript) mobile app for **drivers and owner-operators**.

**Status:** Not implemented yet (Phase 1 will scaffold Expo here).

## Responsibilities

- Load list & detail, accept/decline, status advancement
- Document capture (camera) → Supabase Storage
- Push notifications (Expo)
- Earnings & profile

## Will consume

- `@freightflow/shared` — types & enums
- `@freightflow/validation` — Zod schemas
- `@freightflow/api` — Supabase data access

See [`../../docs/UI Flow.md`](../../docs/UI%20Flow.md) and [`../../docs/Architecture.md`](../../docs/Architecture.md).
