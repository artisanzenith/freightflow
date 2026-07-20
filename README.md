# FreightFlow — Dispatch Platform for Owner-Operators & Small Fleets

FreightFlow is a production-ready dispatch platform built for owner-operators and small trucking companies in the USA. It helps independent drivers and small fleet managers find, book, dispatch, and get paid for loads — all from a mobile app, with a web-based admin portal for back-office operations.

> This repository currently contains the **project foundation only**: architecture, requirements, roadmap, database plan, and UI flow documentation. No application code has been written yet. This is intentional — we design before we build.

---

## Why This Exists

Owner-operators and small carriers (1–20 trucks) are underserved by enterprise TMS (Transportation Management Systems) that are expensive, complex, and built for large fleets. They typically juggle:

- Load boards (DAT, Truckstop) in one place
- Rate negotiation over the phone
- Paperwork (rate confirmations, BOLs, PODs) via email and text
- Invoicing and factoring in spreadsheets
- Compliance (HOS, ELD, IFTA) in separate apps

FreightFlow consolidates the dispatch lifecycle into a single, mobile-first workflow with a lightweight admin portal for dispatchers and owners.

---

## What We're Building

| Surface          | Audience                               | Purpose                                                               |
| ---------------- | -------------------------------------- | --------------------------------------------------------------------- |
| **Mobile App**   | Drivers, owner-operators               | Find loads, accept/dispatch, upload documents, track status, get paid |
| **Admin Portal** | Dispatchers, fleet owners, back-office | Manage loads, drivers, customers, invoicing, reporting, compliance    |
| **Backend**      | —                                      | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)          |

---

## Tech Stack (Recommended)

See [docs/Architecture.md](docs/Architecture.md) for the full rationale.

- **Mobile:** React Native + Expo (TypeScript)
- **Admin Portal:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend / BaaS:** Supabase — Postgres, Auth (RLS), Storage, Edge Functions (Deno), Realtime
- **State/Data:** TanStack Query + Supabase JS client
- **Monorepo:** pnpm workspaces + Turborepo
- **Shared code:** TypeScript packages for types, validation (Zod), and API access
- **Infra/CI:** GitHub Actions, EAS (Expo Application Services) for mobile builds, Vercel for admin portal
- **Observability:** Sentry (errors), PostHog (product analytics)

---

## Repository Structure

```
thebest/
├── README.md                  # You are here
├── docs/                      # Project foundation (design-first)
│   ├── Product Requirements.md
│   ├── Architecture.md
│   ├── Development Roadmap.md
│   ├── Database Plan.md
│   └── UI Flow.md
├── apps/
│   ├── mobile/                # React Native + Expo app (drivers)
│   └── admin/                 # Next.js admin portal (dispatchers/owners)
├── packages/
│   ├── shared/                # Shared TS types, constants, domain models
│   ├── validation/            # Zod schemas shared across apps
│   ├── api/                   # Supabase client wrappers & data access
│   ├── ui/                    # Shared UI primitives (where applicable)
│   └── config/                # Shared eslint, tsconfig, tailwind presets
├── supabase/
│   ├── migrations/            # SQL migrations (source of truth for schema)
│   ├── functions/             # Edge Functions (Deno)
│   ├── policies/              # RLS policy definitions
│   └── seed/                  # Seed data for local/dev
└── .github/
    └── workflows/             # CI/CD pipelines
```

The structure is a **monorepo** so mobile, admin, and backend share types and validation logic. This prevents drift between client and server contracts and keeps the domain model in one place.

---

## Documentation Index

| Document                                                  | Purpose                                             |
| --------------------------------------------------------- | --------------------------------------------------- |
| [Product Requirements.md](docs/Product%20Requirements.md) | Vision, personas, features, scope, success metrics  |
| [Architecture.md](docs/Architecture.md)                   | System design, tech stack rationale, security model |
| [Development Roadmap.md](docs/Development%20Roadmap.md)   | Phased delivery plan from MVP to scale              |
| [Database Plan.md](docs/Database%20Plan.md)               | Data model, tables, relationships, RLS strategy     |
| [UI Flow.md](docs/UI%20Flow.md)                           | Screen flows and navigation for both surfaces       |

---

## Status

🟡 **Phase 0 — Foundation & Design.** Documentation complete. Implementation not started.

## Getting Started (Future)

Once implementation begins, this section will document local setup: installing dependencies, running Supabase locally, seeding data, and starting the mobile and admin apps. See the [Development Roadmap](docs/Development%20Roadmap.md) for sequencing.

---

## Principles

1. **Design before code.** Every feature starts with a requirement and a data contract.
2. **Mobile-first.** Drivers live in their trucks, not at desks.
3. **Modular & scalable.** Shared packages, clear boundaries, no tight coupling.
4. **Security by default.** Row-Level Security on every table; least-privilege access.
5. **US-market focused.** DOT/FMCSA compliance, USD, US address/phone formats, imperial units.
