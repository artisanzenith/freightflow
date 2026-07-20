-- =============================================================================
-- FreightFlow — 0001: Extensions, enums, and RLS helper functions
-- =============================================================================
-- This migration establishes the primitives every later migration depends on:
--   * PostgreSQL extensions
--   * Enumerated types for constrained domains
--   * SECURITY DEFINER helper functions used by Row Level Security policies
--
-- No tables are created here.
-- =============================================================================

-- --- Extensions -------------------------------------------------------------
create extension if not exists "pgcrypto" with schema extensions;      -- gen_random_uuid()
create extension if not exists "uuid-ossp" with schema extensions;     -- uuid helpers
create extension if not exists "citext" with schema extensions;        -- case-insensitive text (emails)

-- --- Enums -------------------------------------------------------------------

-- Application role of a user within their company.
create type public.user_role as enum (
  'owner',        -- company owner / operator (full control of their tenant)
  'dispatcher',   -- manages loads and drivers
  'driver',       -- operates trucks, sees assigned loads
  'accountant',   -- finance visibility
  'admin'         -- platform administrator (cross-tenant, internal)
);

-- Lifecycle state of a user account.
create type public.user_status as enum (
  'invited',
  'active',
  'suspended',
  'deactivated'
);

-- Company / tenant type.
create type public.company_type as enum (
  'owner_operator',   -- single owner-operator
  'small_fleet',      -- small trucking company
  'carrier',
  'broker'
);

-- Equipment operational status (shared by trucks and trailers).
create type public.equipment_status as enum (
  'active',
  'in_maintenance',
  'out_of_service',
  'retired'
);

-- Trailer equipment category.
create type public.trailer_type as enum (
  'dry_van',
  'reefer',
  'flatbed',
  'step_deck',
  'lowboy',
  'tanker',
  'car_hauler',
  'other'
);

-- Status of an inbound load request (before it becomes a committed load).
create type public.load_request_status as enum (
  'new',
  'reviewing',
  'quoted',
  'accepted',
  'rejected',
  'expired',
  'converted'     -- converted into a load
);

-- Status of a committed load through its lifecycle.
create type public.load_status as enum (
  'draft',
  'posted',
  'assigned',
  'dispatched',
  'in_transit',
  'delivered',
  'completed',
  'cancelled'
);

-- Message delivery channel / kind.
create type public.message_type as enum (
  'text',
  'system',
  'attachment'
);

-- Notification category.
create type public.notification_type as enum (
  'load',
  'document',
  'message',
  'payment',
  'system'
);

-- Financial expense category.
create type public.expense_category as enum (
  'fuel',
  'maintenance',
  'tolls',
  'insurance',
  'permits',
  'lease',
  'payroll',
  'meals',
  'lodging',
  'other'
);

-- Payment / settlement status shared by expenses and revenue.
create type public.payment_status as enum (
  'pending',
  'invoiced',
  'paid',
  'overdue',
  'void'
);

-- --- Generic trigger helper --------------------------------------------------
-- NOTE: RLS helper functions that reference public.users are defined in the
-- Row Level Security migration (0008), after the tables they query exist.
-- This function references no table, so it lives here for use by table triggers.

-- Generic updated_at maintenance trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
