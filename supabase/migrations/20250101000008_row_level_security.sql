-- =============================================================================
-- FreightFlow — 0008: Row Level Security (enable + policies for every table)
-- =============================================================================
-- Security model:
--   * Every tenant table is isolated by company_id.
--   * Reads: any authenticated member of the owning company.
--   * Writes: managers (owner/dispatcher/admin) by default; some tables allow
--     the record owner (e.g. own profile, own notifications).
--   * Platform admins (role = 'admin') are members of their own company and are
--     not granted cross-tenant access here by design (kept least-privilege).
--   * The service_role key bypasses RLS entirely for server-side jobs.
--
-- Helper functions (defined below, now that public.users exists):
--   current_company_id(), current_user_role(), is_company_member(),
--   is_company_manager(), is_platform_admin()
-- =============================================================================

-- --- RLS helper functions ----------------------------------------------------
-- SECURITY DEFINER so they can read public.users without being blocked by the
-- policies that reference them (which would otherwise recurse). Defined here
-- because they query public.users, which is created in migration 0002.

-- Returns the company_id of the currently authenticated user.
create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.users where id = auth.uid();
$$;

-- Returns the application role of the currently authenticated user.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- True when the current user belongs to the given company.
create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and company_id = target_company_id
  );
$$;

-- True when the current user is an owner/dispatcher/admin (management roles).
create or replace function public.is_company_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('owner', 'dispatcher', 'admin')
     from public.users where id = auth.uid()),
    false
  );
$$;

-- True when the current user is a platform admin.
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.users where id = auth.uid()),
    false
  );
$$;

-- Enable + force RLS on all tenant tables.
alter table public.companies             enable row level security;
alter table public.users                 enable row level security;
alter table public.profiles              enable row level security;
alter table public.trucks                enable row level security;
alter table public.trailers              enable row level security;
alter table public.load_requests         enable row level security;
alter table public.loads                 enable row level security;
alter table public.load_status_history   enable row level security;
alter table public.document_categories   enable row level security;
alter table public.documents             enable row level security;
alter table public.messages              enable row level security;
alter table public.notifications         enable row level security;
alter table public.expenses              enable row level security;
alter table public.revenue               enable row level security;
alter table public.settings              enable row level security;

-- ===========================================================================
-- companies
-- ===========================================================================
create policy "companies_select_member"
  on public.companies for select to authenticated
  using (public.is_company_member(id));

create policy "companies_update_manager"
  on public.companies for update to authenticated
  using (public.is_company_member(id) and public.is_company_manager())
  with check (public.is_company_member(id) and public.is_company_manager());

-- Company creation/deletion is handled by privileged onboarding (service role).

-- ===========================================================================
-- users
-- ===========================================================================
create policy "users_select_self_or_company"
  on public.users for select to authenticated
  using (id = auth.uid() or company_id = public.current_company_id());

create policy "users_update_self"
  on public.users for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "users_manage_company_members"
  on public.users for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());

-- ===========================================================================
-- profiles
-- ===========================================================================
create policy "profiles_select_company"
  on public.profiles for select to authenticated
  using (company_id = public.current_company_id());

create policy "profiles_insert_self_or_manager"
  on public.profiles for insert to authenticated
  with check (
    company_id = public.current_company_id()
    and (id = auth.uid() or public.is_company_manager())
  );

create policy "profiles_update_self_or_manager"
  on public.profiles for update to authenticated
  using (
    company_id = public.current_company_id()
    and (id = auth.uid() or public.is_company_manager())
  )
  with check (
    company_id = public.current_company_id()
    and (id = auth.uid() or public.is_company_manager())
  );

-- ===========================================================================
-- Generic tenant tables: SELECT for members, write for managers.
-- Implemented per-table for clarity/auditability.
-- ===========================================================================

-- --- trucks ------------------------------------------------------------------
create policy "trucks_select_company" on public.trucks for select to authenticated
  using (company_id = public.current_company_id());
create policy "trucks_insert_manager" on public.trucks for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "trucks_update_manager" on public.trucks for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "trucks_delete_manager" on public.trucks for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- trailers ----------------------------------------------------------------
create policy "trailers_select_company" on public.trailers for select to authenticated
  using (company_id = public.current_company_id());
create policy "trailers_insert_manager" on public.trailers for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "trailers_update_manager" on public.trailers for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "trailers_delete_manager" on public.trailers for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- load_requests -----------------------------------------------------------
create policy "load_requests_select_company" on public.load_requests for select to authenticated
  using (company_id = public.current_company_id());
create policy "load_requests_insert_manager" on public.load_requests for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "load_requests_update_manager" on public.load_requests for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "load_requests_delete_manager" on public.load_requests for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- loads -------------------------------------------------------------------
-- Drivers may read loads assigned to them; managers see all company loads.
create policy "loads_select_company" on public.loads for select to authenticated
  using (
    company_id = public.current_company_id()
    and (public.is_company_manager() or driver_id = auth.uid())
  );
create policy "loads_insert_manager" on public.loads for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "loads_update_manager" on public.loads for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "loads_delete_manager" on public.loads for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- load_status_history (append-only) --------------------------------------
create policy "load_status_history_select_company" on public.load_status_history for select to authenticated
  using (company_id = public.current_company_id());
create policy "load_status_history_insert_member" on public.load_status_history for insert to authenticated
  with check (company_id = public.current_company_id());
-- No update/delete: audit trail is immutable to clients.

-- --- document_categories -----------------------------------------------------
-- Members can read their company categories plus global (company_id is null).
create policy "doc_categories_select" on public.document_categories for select to authenticated
  using (company_id = public.current_company_id() or company_id is null);
create policy "doc_categories_insert_manager" on public.document_categories for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "doc_categories_update_manager" on public.document_categories for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "doc_categories_delete_manager" on public.document_categories for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- documents ---------------------------------------------------------------
create policy "documents_select_company" on public.documents for select to authenticated
  using (company_id = public.current_company_id());
create policy "documents_insert_member" on public.documents for insert to authenticated
  with check (company_id = public.current_company_id());
create policy "documents_update_owner_or_manager" on public.documents for update to authenticated
  using (
    company_id = public.current_company_id()
    and (uploaded_by = auth.uid() or public.is_company_manager())
  )
  with check (
    company_id = public.current_company_id()
    and (uploaded_by = auth.uid() or public.is_company_manager())
  );
create policy "documents_delete_owner_or_manager" on public.documents for delete to authenticated
  using (
    company_id = public.current_company_id()
    and (uploaded_by = auth.uid() or public.is_company_manager())
  );

-- --- messages ----------------------------------------------------------------
-- A member can read messages in their company where they are sender or
-- recipient; managers can read all company messages.
create policy "messages_select_participant" on public.messages for select to authenticated
  using (
    company_id = public.current_company_id()
    and (public.is_company_manager() or sender_id = auth.uid() or recipient_id = auth.uid())
  );
create policy "messages_insert_sender" on public.messages for insert to authenticated
  with check (company_id = public.current_company_id() and sender_id = auth.uid());
create policy "messages_update_sender" on public.messages for update to authenticated
  using (company_id = public.current_company_id() and sender_id = auth.uid())
  with check (company_id = public.current_company_id() and sender_id = auth.uid());
create policy "messages_delete_sender" on public.messages for delete to authenticated
  using (company_id = public.current_company_id() and sender_id = auth.uid());

-- --- notifications -----------------------------------------------------------
-- Users see only their own notifications. Inserts are typically done by the
-- service role (server), but we allow same-company insert for flexibility.
create policy "notifications_select_own" on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy "notifications_insert_company" on public.notifications for insert to authenticated
  with check (company_id = public.current_company_id());
create policy "notifications_update_own" on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "notifications_delete_own" on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- --- expenses ----------------------------------------------------------------
-- Read for members; write for managers and accountants.
create policy "expenses_select_company" on public.expenses for select to authenticated
  using (company_id = public.current_company_id());
create policy "expenses_insert_finance" on public.expenses for insert to authenticated
  with check (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  );
create policy "expenses_update_finance" on public.expenses for update to authenticated
  using (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  )
  with check (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  );
create policy "expenses_delete_manager" on public.expenses for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- revenue -----------------------------------------------------------------
create policy "revenue_select_company" on public.revenue for select to authenticated
  using (company_id = public.current_company_id());
create policy "revenue_insert_finance" on public.revenue for insert to authenticated
  with check (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  );
create policy "revenue_update_finance" on public.revenue for update to authenticated
  using (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  )
  with check (
    company_id = public.current_company_id()
    and (public.is_company_manager() or public.current_user_role() = 'accountant')
  );
create policy "revenue_delete_manager" on public.revenue for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());

-- --- settings ----------------------------------------------------------------
create policy "settings_select_company" on public.settings for select to authenticated
  using (company_id = public.current_company_id());
create policy "settings_insert_manager" on public.settings for insert to authenticated
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "settings_update_manager" on public.settings for update to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager())
  with check (company_id = public.current_company_id() and public.is_company_manager());
create policy "settings_delete_manager" on public.settings for delete to authenticated
  using (company_id = public.current_company_id() and public.is_company_manager());
