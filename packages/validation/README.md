# packages/validation

Zod schemas shared across the mobile app, admin portal, and Edge Functions.

**Status:** Not implemented yet.

## Purpose

- Single source of truth for input validation (runtime + static types)
- Reused at every boundary: client form submit and server (Edge Function) entry
- Derives TypeScript types from schemas to stay in sync with `packages/shared`
