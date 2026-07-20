# Development Roadmap

**Product:** FreightFlow
**Version:** 0.1 (Foundation)
**Status:** Draft

This roadmap is phased and outcome-driven. Each phase has a clear goal, scope, and exit criteria. Timeframes are indicative for a small team (2–4 engineers) and should be re-estimated after Phase 1.

---

## Phase 0 — Foundation & Design ✅ (current)

**Goal:** Align on product, architecture, and data model before writing app code.

- [x] Product Requirements
- [x] Architecture & tech stack
- [x] Database plan
- [x] UI flow
- [x] Repository structure & documentation

**Exit criteria:** Docs reviewed and approved; stack decisions locked.

---

## Phase 1 — Project Scaffolding & Infrastructure

**Goal:** Stand up the monorepo, Supabase project, CI, and a "hello world" through the full stack.

- Initialize pnpm + Turborepo monorepo.
- Scaffold `apps/mobile` (Expo) and `apps/admin` (Next.js).
- Create shared packages (`shared`, `validation`, `api`, `config`).
- Provision Supabase (local via CLI + cloud staging).
- Wire GitHub Actions (lint, typecheck, test).
- Set up Sentry + PostHog.
- Establish migration workflow and seed script.

**Exit criteria:** Both apps run locally against Supabase; CI green; one end-to-end read/write demonstrated.

---

## Phase 2 — Auth, Tenancy & Onboarding (MVP core)

**Goal:** Secure, multi-tenant access with roles.

- Supabase Auth (email/password + phone OTP).
- `companies`, `profiles`, roles.
- RLS policies for tenant isolation on all core tables.
- Onboarding flows: company setup, driver invitations.
- Role-based navigation (mobile + admin).

**Exit criteria:** A company can be created, users invited, and each role sees only their tenant's data (RLS verified with tests).

---

## Phase 3 — Load Management & Dispatch (MVP core)

**Goal:** The core dispatch lifecycle works end to end.

- Load CRUD (admin) + load list/board views.
- Load status lifecycle + `load_status_history`.
- Assign load to driver/truck.
- Driver accept/decline + status updates (mobile).
- Realtime sync between admin and mobile.
- Push notifications for assignments & status changes.

**Exit criteria:** A dispatcher can create and assign a load; a driver can accept and move it through delivery; both surfaces stay in sync in realtime.

---

## Phase 4 — Documents & Invoicing (MVP completion)

**Goal:** Capture proof and get paid.

- Document capture/upload (mobile camera) to Storage.
- Document linking + required-doc checklist per load.
- Invoice generation from delivered loads.
- Invoice status tracking (draft → sent → paid → overdue).
- PDF invoice generation (Edge Function).

**Exit criteria:** A delivered load can produce a branded PDF invoice with attached POD; invoice status is tracked.

**🎯 MVP shippable at end of Phase 4.**

---

## Phase 5 — Customers, Dashboards & Reporting

**Goal:** Operational visibility and back-office efficiency.

- Customer (broker/shipper) records + load history.
- Admin dashboards: revenue/margin by driver/customer/period.
- Invoice aging report.
- Email notifications (invoices, document requests).

**Exit criteria:** Owners can see profitability and outstanding invoices; customers are managed as first-class records.

---

## Phase 6 — Field Resilience & Location

**Goal:** Make the app dependable in the real world.

- Offline mutation queue (status updates, uploads survive poor connectivity).
- Location check-ins at status events; basic GPS breadcrumbs.
- Retry/backoff and conflict handling.

**Exit criteria:** Drivers can operate through connectivity gaps without data loss.

---

## Phase 7 — Integrations & Compliance

**Goal:** Connect to the broader ecosystem.

- Factoring/accounting export (CSV, QuickBooks).
- Compliance records: authority, insurance, license/medical expirations + reminders.
- Load board integrations (DAT, Truckstop) behind adapter layer.
- Groundwork for ELD/IFTA (later).

**Exit criteria:** Carriers can export to factoring/accounting and track compliance expirations.

---

## Phase 8 — Hardening & Launch

**Goal:** Production readiness.

- Performance passes (indexing, query tuning, pagination).
- Security review (RLS audit, storage policies, secret handling).
- Accessibility pass.
- Load/perf testing; error budgets and alerts.
- App Store / Play Store submission; production Supabase + backups/PITR.

**Exit criteria:** Apps published; SLOs defined; on-call/alerting in place.

---

## Cross-Cutting Workstreams (continuous)

- **Testing:** Unit (shared/validation), integration (RLS, Edge Functions), E2E (critical flows).
- **Design system:** Evolve `packages/ui` tokens/components.
- **Docs:** Keep `docs/` current as decisions change (treat as living documents).
- **Analytics:** Instrument activation/retention funnels from Phase 2 onward.

## Sequencing Rationale

We front-load **auth + tenancy** (Phase 2) because RLS is foundational and hard to retrofit. The **dispatch lifecycle** (Phase 3) is the product's beating heart, so it precedes documents/invoicing. Field resilience (Phase 6) comes after the happy path works, and integrations/compliance (Phase 7) are deferred because they carry external cost and complexity that shouldn't block MVP.
