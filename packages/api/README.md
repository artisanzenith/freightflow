# packages/api

Typed Supabase client wrappers and data-access functions.

**Status:** Not implemented yet.

## Purpose

- Centralize Supabase client creation (per-surface config)
- Provide typed query/mutation helpers for each entity
- Encapsulate RLS-aware data access so apps don't hand-write queries
- Wrap Edge Function invocations (invoicing, integrations)
