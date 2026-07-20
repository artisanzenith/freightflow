-- =============================================================================
-- FreightFlow — 0006: Communication tables (messages, notifications)
-- =============================================================================
-- messages       → threaded conversation entries, optionally scoped to a load
-- notifications  → per-user system notifications (in-app / push fan-out target)
--
-- Schema only. Delivery/push logic lives in later app + edge function work.
-- =============================================================================

-- --- messages ----------------------------------------------------------------
-- A lightweight messaging model. Messages are grouped by `thread_id` (a client
-- or server generated conversation id) and may reference a load for context.
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  thread_id       uuid not null,                 -- conversation grouping key
  sender_id       uuid references public.users (id) on delete set null,
  recipient_id    uuid references public.users (id) on delete set null,
  load_id         uuid references public.loads (id) on delete set null,
  type            public.message_type not null default 'text',
  body            text,
  document_id     uuid references public.documents (id) on delete set null,
  read_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint messages_body_or_attachment
    check (body is not null or document_id is not null or type = 'system')
);

comment on table public.messages is 'Threaded messages between company members, optionally load-scoped.';

create index idx_messages_company_id on public.messages (company_id);
create index idx_messages_thread_id on public.messages (thread_id);
create index idx_messages_sender_id on public.messages (sender_id);
create index idx_messages_recipient_id on public.messages (recipient_id);
create index idx_messages_load_id on public.messages (load_id);
create index idx_messages_created_at on public.messages (created_at);

create trigger trg_messages_updated_at
  before update on public.messages
  for each row execute function public.set_updated_at();

-- --- notifications -----------------------------------------------------------
create table public.notifications (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  type            public.notification_type not null default 'system',
  title           text not null,
  body            text,
  -- Optional deep-link context to the originating entity.
  load_id         uuid references public.loads (id) on delete cascade,
  document_id     uuid references public.documents (id) on delete cascade,
  message_id      uuid references public.messages (id) on delete cascade,
  data            jsonb not null default '{}'::jsonb,   -- arbitrary payload
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

comment on table public.notifications is 'Per-user in-app notifications and push fan-out targets.';

create index idx_notifications_company_id on public.notifications (company_id);
create index idx_notifications_user_id on public.notifications (user_id);
create index idx_notifications_type on public.notifications (type);
create index idx_notifications_created_at on public.notifications (created_at);
-- Fast lookup of a user's unread notifications.
create index idx_notifications_user_unread
  on public.notifications (user_id)
  where read_at is null;
