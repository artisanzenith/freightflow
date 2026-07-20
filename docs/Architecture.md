# Architecture

**Product:** FreightFlow
**Version:** 0.1 (Foundation)
**Status:** Draft

---

## 1. Architectural Overview

FreightFlow is a **Supabase-backed, multi-tenant SaaS** with two client surfaces (a React Native mobile app and a Next.js admin portal) sharing a common TypeScript domain layer through a **pnpm + Turborepo monorepo**.

```
                    ┌──────────────────────────┐
                    │       Client Surfaces      │
                    │                            │
   ┌────────────────┴───────┐      ┌─────────────┴────────────────┐
   │  Mobile App (Expo/RN)  │      │  Admin Portal (Next.js)       │
   │  Drivers / Owner-Ops   │      │  Dispatchers / Owners / Bill. │
   └────────────┬───────────┘      └──────────────┬───────────────┘
                │                                  │
                │   shared packages (types,        │
                │   validation, api client)        │
                └───────────────┬──────────────────┘
                                │
                    ┌───────────▼───────────────┐
                    │         Supabase           │
                    │                            │
                    │  • Postgres (+ RLS)        │
                    │  • Auth (JWT, OTP)         │
                    │  • Storage (documents)     │
                    │  • Edge Functions (Deno)   │
                    │  • Realtime (status sync)  │
                    └───────────┬───────────────┘
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
       ┌──────▼─────┐   ┌───────▼──────┐   ┌───────▼───────┐
       │ Push (FCM/  │   │ Email (Resend│   │ 3rd-party APIs │
       │ APNs/Expo)  │   │ /Postmark)   │   │ (load boards,  │
       └────────────┘   └──────────────┘   │ factoring)     │
                                            └────────────────┘
```

## 2. Tech Stack & Rationale

### 2.1 Mobile — React Native + Expo (TypeScript)

- **Why:** One codebase for iOS + Android; the audience is split across both platforms. Expo provides managed builds (EAS), OTA updates, camera, push notifications, and secure storage out of the box — critical for a small team shipping fast.
- **Navigation:** Expo Router (file-based) or React Navigation.
- **Why not native (Swift/Kotlin):** Two codebases, slower iteration, higher cost with no v1 benefit.

### 2.2 Admin Portal — Next.js (App Router) + TypeScript + Tailwind

- **Why:** Server components + server actions pair cleanly with Supabase. Great DX, SEO for marketing pages, and easy deployment on Vercel. Tailwind keeps UI consistent and fast to build.
- **Why not a SPA (plain React/Vite):** We want SSR for auth-gated dashboards and fast first loads; Next.js gives us both SSR and client interactivity.

### 2.3 Backend — Supabase

- **Postgres:** Relational data (loads, drivers, customers, invoices) is inherently relational. Postgres gives us strong constraints, transactions, and SQL reporting.
- **Auth:** Email/password + phone OTP, JWT-based. Integrates with RLS directly via `auth.uid()`.
- **Row-Level Security (RLS):** The backbone of multi-tenancy. Every table enforces tenant isolation at the database layer, not just the app layer.
- **Storage:** Document files (PODs, BOLs, rate cons) with signed URLs and RLS-backed buckets.
- **Edge Functions (Deno):** Server-side logic that shouldn't live on the client — invoice PDF generation, webhook handlers, third-party API calls, scheduled jobs.
- **Realtime:** Push load/status changes to the admin portal and mobile app without polling.
- **Why Supabase over a custom backend:** Faster time-to-market, built-in auth + storage + realtime, managed Postgres, and no server maintenance. It scales to our target segment and can be extended with Edge Functions where needed.

### 2.4 Shared Layer (Monorepo Packages)

- `packages/shared` — domain types, enums (load status, roles), constants.
- `packages/validation` — Zod schemas used by both clients and Edge Functions (single source of truth for validation).
- `packages/api` — typed Supabase client wrappers and data-access functions.
- `packages/config` — shared ESLint, Prettier, TypeScript, and Tailwind presets.
- `packages/ui` — shared UI primitives/tokens where reuse is practical (design tokens shared even if components differ per platform).

### 2.5 Tooling

- **Monorepo:** pnpm workspaces + Turborepo (task caching, parallel builds).
- **Language:** TypeScript everywhere (including Edge Functions).
- **Validation:** Zod (runtime + static types).
- **Data fetching/cache:** TanStack Query on both clients.
- **CI/CD:** GitHub Actions; EAS for mobile; Vercel for admin.
- **Observability:** Sentry (crash/error), PostHog (product analytics).

## 3. Multi-Tenancy Model

- Each **company** (carrier) is a tenant. All tenant-scoped tables carry a `company_id`.
- A **profiles** table links `auth.users` to a company and a role.
- **RLS policies** ensure a user can only read/write rows where `company_id` matches their profile's company.
- Roles: `owner`, `dispatcher`, `driver`, `billing`. Role checks live in RLS policies and (for defense in depth) in the API layer.

## 4. Security Model

- **Authentication:** Supabase Auth (JWT). Tokens carry `auth.uid()`.
- **Authorization:** RLS on every table. Default-deny; explicit policies grant access.
- **Storage:** Private buckets; access via short-lived signed URLs. Bucket paths namespaced by `company_id`.
- **Secrets:** Never in the client. Service-role key used only inside Edge Functions.
- **Input validation:** Zod at every boundary (client submit + Edge Function entry).
- **Transport:** HTTPS/TLS everywhere.
- **Audit:** `created_at`, `updated_at`, `created_by` on mutable tables; append-only status history for loads.
- **PII/compliance:** Minimize stored PII; document retention policy for compliance docs.

## 5. Data Flow Examples

### Assigning & dispatching a load

1. Dispatcher creates a load in the admin portal → validated by Zod → inserted via Supabase client (RLS enforces tenant).
2. Dispatcher assigns load to a driver → `load.status = dispatched`, `assigned_driver_id` set.
3. Realtime pushes the new assignment to the driver's mobile app; a push notification fires (Edge Function → Expo push).
4. Driver accepts and updates status through the lifecycle; each change writes a `load_status_history` row.
5. Admin portal reflects status changes in realtime.

### Capturing a POD and invoicing

1. Driver captures POD photo → uploaded to Storage (company-namespaced path) → `document` row links it to the load.
2. On `delivered`, back-office generates an invoice (Edge Function builds PDF, stores it, creates `invoice` row).
3. Invoice status tracked to `paid`; optional export to factoring/accounting.

## 6. Environments

- **Local:** Supabase CLI (local Postgres, Auth, Storage), Expo dev client, Next.js dev server.
- **Staging:** Dedicated Supabase project; preview deployments (Vercel) and EAS preview builds.
- **Production:** Separate Supabase project; Vercel production; EAS production builds to app stores.
- Schema changes flow through **migrations** (checked into `supabase/migrations`) — never hand-edited in the dashboard.

## 7. Scalability & Performance

- Postgres indexing on hot query paths (company_id, status, dates).
- TanStack Query caching + realtime to minimize redundant fetches.
- Edge Functions for heavy/async work (PDF gen, third-party calls) to keep clients responsive.
- Pagination and filtered queries for large load lists.
- Turborepo caching for fast CI.

## 8. Observability & Reliability

- **Errors:** Sentry on mobile, admin, and Edge Functions.
- **Analytics:** PostHog for activation/retention funnels.
- **Logging:** Structured logs in Edge Functions.
- **Backups:** Supabase automated Postgres backups; point-in-time recovery on production.
- **Alerts:** Error-rate and latency alerts wired to the team channel.

## 9. Key Architectural Decisions (ADR summary)

| Decision        | Choice                    | Rationale                                          |
| --------------- | ------------------------- | -------------------------------------------------- |
| Client platform | React Native + Expo       | One codebase, fast iteration, field-ready features |
| Admin platform  | Next.js                   | SSR auth dashboards, great Supabase pairing        |
| Backend         | Supabase                  | Auth + Postgres + Storage + Realtime, low ops      |
| Repo model      | pnpm + Turborepo monorepo | Shared types/validation, no client-server drift    |
| Tenancy         | RLS + company_id          | DB-enforced isolation, defense in depth            |
| Validation      | Zod (shared)              | Single source of truth, runtime + types            |

## 10. Risks & Mitigations

- **Vendor lock-in (Supabase):** Mitigate by keeping business logic in portable TS packages and standard Postgres; avoid proprietary-only patterns where feasible.
- **Offline field use:** Design mutation queue early (P1) so status updates/doc uploads survive poor connectivity.
- **Third-party integration cost/complexity (load boards, ELD):** Isolate behind Edge Functions and an integration adapter layer so they can be added/removed without touching clients.
