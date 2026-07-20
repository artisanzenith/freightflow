# Product Requirements Document (PRD)

**Product:** FreightFlow — Dispatch Platform for Owner-Operators & Small Fleets
**Version:** 0.1 (Foundation)
**Status:** Draft
**Owner:** Product / Architecture

---

## 1. Vision

Give US owner-operators and small trucking companies a single, mobile-first tool to run their dispatch operation — from finding a load to getting paid — replacing the patchwork of load boards, phone calls, texts, spreadsheets, and email that they use today.

## 2. Problem Statement

Small carriers (1–20 trucks) operate on thin margins and limited administrative capacity. Enterprise TMS platforms are too expensive and complex. As a result, dispatch work is manual, error-prone, and hard to scale. Key pain points:

- Loads are tracked across disconnected tools.
- Documents (rate confirmations, BOLs, PODs) are lost in email/text threads.
- Invoicing and factoring are managed manually, delaying cash flow.
- No single source of truth for load status, driver location, or profitability.
- Compliance data (HOS, IFTA, insurance, authority) lives in separate systems.

## 3. Goals & Non-Goals

### Goals

- Provide a **mobile app** that lets drivers manage the full load lifecycle.
- Provide an **admin portal** for dispatchers/owners to manage operations.
- Centralize loads, documents, customers, and invoicing.
- Enable fast, reliable status updates and document capture from the field.
- Be production-ready: secure, observable, and scalable.

### Non-Goals (for v1)

- Building our own load board / marketplace (we integrate, not replace).
- Native ELD hardware integration (planned later; API integrations first).
- Full accounting suite (we support invoicing + export, not GL/payroll).
- International/cross-border freight (US domestic first).

## 4. Personas

### P1 — Independent Owner-Operator ("Marcus")

Drives his own truck, runs his own business. Needs everything on his phone. Low patience for complex software. Wants to find loads, confirm rates, capture PODs, and invoice fast.

### P2 — Small Fleet Owner ("Diana")

Owns 5–15 trucks. Splits time between driving, dispatching, and admin. Needs to assign loads to drivers, see everyone's status at a glance, and manage cash flow.

### P3 — Dispatcher ("Ray")

Works for a small fleet or as an independent dispatcher. Lives in the admin portal. Books loads, negotiates rates, assigns drivers, chases documents, and manages customer relationships.

### P4 — Back-Office / Billing ("Sofia")

Handles invoicing, factoring submissions, and payment reconciliation. Needs clean documents and accurate load/rate data.

## 5. Feature Requirements

Priority: **P0** = MVP must-have, **P1** = fast-follow, **P2** = later.

### 5.1 Authentication & Onboarding

- P0: Email/password and phone (OTP) auth via Supabase Auth.
- P0: Role-based access (owner, dispatcher, driver, billing).
- P0: Multi-tenant model — each company is an isolated tenant.
- P1: Carrier profile setup (MC/DOT number, authority, insurance docs).
- P1: Driver invitation flow (owner invites drivers by phone/email).

### 5.2 Load Management

- P0: Create, edit, and view loads (origin, destination, pickup/delivery windows, commodity, weight, rate, customer).
- P0: Load status lifecycle (see Database Plan).
- P0: Assign a load to a driver/truck.
- P1: Import load details from rate confirmation (manual entry first, OCR later).
- P2: Direct load board integrations (DAT, Truckstop).

### 5.3 Dispatch & Status Tracking

- P0: Driver accepts/declines assigned loads in mobile app.
- P0: Status updates (dispatched, at pickup, loaded, in transit, at delivery, delivered).
- P0: Realtime status sync between mobile and admin portal.
- P1: Location check-ins / basic GPS breadcrumbs at status events.
- P2: Continuous background location tracking + ETA.

### 5.4 Document Management

- P0: Upload/capture documents (rate con, BOL, POD) via mobile camera.
- P0: Store documents in Supabase Storage, linked to loads.
- P1: Document type tagging and required-doc checklists per load.
- P2: OCR extraction to auto-populate fields.

### 5.5 Invoicing & Payments

- P0: Generate an invoice from a completed load.
- P0: Track invoice status (draft, sent, paid, overdue).
- P1: PDF invoice generation with carrier branding.
- P1: Export to factoring companies / accounting (CSV, QuickBooks format).
- P2: In-app payment collection.

### 5.6 Customers (Brokers/Shippers)

- P0: Manage customer records (broker/shipper contact, MC number, credit notes).
- P1: Link loads to customers; view load history per customer.

### 5.7 Admin Portal Dashboards

- P0: Load board view (all loads by status).
- P0: Driver roster and current assignments.
- P1: Revenue/margin reporting by driver, customer, and period.
- P1: Aging report for unpaid invoices.

### 5.8 Notifications

- P0: Push notifications (mobile) for new assignments and status changes.
- P1: Email notifications for invoices and document requests.

### 5.9 Compliance (Foundational)

- P1: Store carrier authority, insurance, and driver license/medical card expirations.
- P1: Expiration reminders.
- P2: IFTA mileage tracking and HOS/ELD integrations.

## 6. Success Metrics

- **Activation:** % of new carriers who create and complete their first load within 7 days.
- **Retention:** Weekly active driver rate; monthly active carrier rate.
- **Time-to-invoice:** Median hours from delivery to invoice sent.
- **Document completeness:** % of delivered loads with a POD attached.
- **Reliability:** Crash-free session rate > 99.5%; API p95 latency targets met.

## 7. Constraints & Assumptions

- US domestic market only for v1 (USD, imperial units, US phone/address formats).
- Mobile app must be usable on low-end Android devices and older iPhones.
- Field connectivity is unreliable; app must degrade gracefully and queue actions offline (P1).
- Regulatory context: DOT/FMCSA identifiers (MC/DOT), but we are not an ELD provider in v1.

## 8. Open Questions

- Pricing model: per-truck subscription vs. per-load fee?
- Do we support independent dispatchers managing multiple carriers under one login?
- Which factoring companies to prioritize for export integrations?
- Offline-first scope for MVP vs. fast-follow?

## 9. Out-of-Scope Risks to Monitor

- Load board integration terms/costs (DAT, Truckstop APIs).
- ELD integration complexity and certification.
- Payment/factoring compliance and money-movement licensing.
