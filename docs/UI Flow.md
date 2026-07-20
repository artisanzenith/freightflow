# UI Flow

**Product:** FreightFlow
**Version:** 0.1 (Foundation)
**Status:** Draft

This document maps the primary navigation and screen flows for both surfaces: the **Mobile App** (drivers/owner-operators) and the **Admin Portal** (dispatchers/owners/billing). It focuses on flow and information architecture, not visual design.

---

## 1. Design Principles

- **Mobile-first for drivers.** Big tap targets, minimal typing, camera-forward, works one-handed.
- **Task-oriented.** Each screen answers "what do I do next?"
- **Status is king.** Load status is always visible and easy to advance.
- **Admin is data-dense but scannable.** Tables, filters, and quick actions.
- **Role-aware.** Navigation adapts to `owner` / `dispatcher` / `driver` / `billing`.

---

## 2. Mobile App (Drivers / Owner-Operators)

### 2.1 Navigation Model

Bottom tab navigation:

```
[ Loads ] [ Documents ] [ Earnings ] [ Profile ]
```

### 2.2 Auth & Onboarding Flow

```
Splash
  → Sign In (email/password or phone OTP)
      → (new invited driver) Accept Invite → Set Password → Link to Company
      → (existing) Home
  → Forgot Password
```

### 2.3 Loads Tab (primary)

```
Loads List (grouped: Assigned / In Progress / Completed)
  → Load Detail
       • Route (origin → destination), windows, rate, commodity, notes
       • Customer info
       • Actions (context-aware by status):
            - Accept / Decline   (when dispatched)
            - Advance Status     (At Pickup → Loaded → In Transit → At Delivery → Delivered)
            - Add Document       (camera/upload)
            - Add Note
       → Status Update Sheet (optional location check-in)
       → Document Capture (camera → preview → tag type → upload)
```

### 2.4 Documents Tab

```
Documents List (by load / by type)
  → Document Detail (view, re-upload, delete if permitted)
  → Quick Capture (camera → tag → link to load)
```

### 2.5 Earnings Tab

```
Earnings Summary (paid / pending)
  → Invoice/Load breakdown (read-only for drivers; owner-ops see full)
```

### 2.6 Profile Tab

```
Profile
  → Personal info, license & medical card (view/expiry)
  → Company info (read-only for drivers)
  → Notifications settings
  → Sign Out
```

### 2.7 Notifications (system)

- New load assigned → deep link to Load Detail.
- Document requested → deep link to Document Capture.
- Status reminder (e.g., mark delivered) → deep link to Load Detail.

---

## 3. Admin Portal (Dispatchers / Owners / Billing)

### 3.1 Navigation Model

Left sidebar:

```
Dashboard
Loads
Drivers
Trucks
Customers
Invoices
Compliance
Reports
Settings
```

Navigation items shown depend on role (e.g., `billing` emphasizes Invoices/Customers; `driver` role does not use the portal).

### 3.2 Auth Flow

```
Sign In (email/password) → Dashboard
Company setup wizard (first-time owner):
  Company profile (name, MC/DOT, address)
   → Invite team (dispatchers, billing)
   → Add drivers / trucks
   → Done → Dashboard
```

### 3.3 Dashboard

```
Dashboard
  • Loads by status (counts + quick filters)
  • Today's pickups / deliveries
  • Unassigned loads (call to action)
  • Unpaid/overdue invoices summary
  • Expiring compliance alerts
```

### 3.4 Loads (core)

```
Loads Board/List (filters: status, driver, customer, date)
  → New Load (form: customer, route, windows, commodity, weight, rate, notes)
  → Load Detail
       • Overview + status timeline (from load_status_history)
       • Assign driver/truck
       • Documents (view uploaded; request missing)
       • Generate Invoice (when delivered)
       • Edit / Cancel
  → Bulk actions (assign, export) [later]
```

### 3.5 Drivers

```
Drivers List
  → Driver Detail (info, current assignment, license/medical expiry, history)
  → Invite Driver (email/phone) → pending until accepted
```

### 3.6 Trucks

```
Trucks List → Truck Detail (unit, VIN, plate, status, assignments)
```

### 3.7 Customers

```
Customers List (brokers/shippers)
  → Customer Detail (contacts, MC #, credit notes, load history)
  → New Customer
```

### 3.8 Invoices

```
Invoices List (filters: status, customer, date; aging view)
  → Invoice Detail (line items, linked load, PDF, status transitions)
  → Create from Load / Manual Invoice
  → Send / Mark Paid / Void / Export
```

### 3.9 Compliance

```
Compliance Overview (expiring soon)
  → Records by type (authority, insurance, IFTA)
  → Add/Update record + attach document
```

### 3.10 Reports

```
Reports
  • Revenue & margin (by driver / customer / period)
  • Invoice aging
  • Load volume & on-time performance
  → Export (CSV)
```

### 3.11 Settings

```
Settings
  • Company profile
  • Team & roles
  • Notification preferences
  • Billing/subscription [later]
  • Integrations (factoring, load boards) [later]
```

---

## 4. Cross-Surface Flow: Load Lifecycle (happy path)

```
[Admin] Dispatcher creates load ......................... status: available
[Admin] Assigns to driver .............................. status: dispatched  ──► push to Mobile
[Mobile] Driver accepts ................................ status: accepted    ──► realtime to Admin
[Mobile] At pickup / loaded / in transit / at delivery . status advances    ──► realtime to Admin
[Mobile] Uploads POD ................................... document linked
[Mobile] Marks delivered ............................... status: delivered   ──► realtime to Admin
[Admin]  Generates invoice ............................. status: invoiced
[Admin]  Invoice paid .................................. status: paid
```

Every transition is reflected in realtime on both surfaces and recorded in the status history.

---

## 5. Empty States & Edge Cases (to design)

- No loads yet (mobile & admin) → guided call to action.
- Driver declines → load returns to `available`, dispatcher notified.
- Missing required documents at delivery → block/flag invoice generation.
- Offline capture (P1) → queued badge, syncs when online.
- Expired license/medical → warning on assignment.

---

## 6. Accessibility & Field Usability

- Minimum 44px tap targets on mobile.
- High-contrast mode and legible type sizes (drivers in cabs, varied lighting).
- Support for voice-free, glove-friendly interactions (large buttons).
- Screen-reader labels on all interactive elements (both surfaces).
