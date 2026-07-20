-- =============================================================================
-- FreightFlow — 0009: Storage buckets (documents, profile-images) + policies
-- =============================================================================
-- Two private buckets are created. Access is controlled by RLS on
-- storage.objects. Object paths are tenant-scoped by convention:
--
--   documents/<company_id>/<entity>/<object>
--   profile-images/<company_id>/<user_id>/<object>
--
-- The first path segment is the company_id; policies compare it against the
-- caller's company to enforce tenant isolation. Neither bucket is public;
-- clients read via signed URLs or authenticated requests.
-- =============================================================================

-- --- Create buckets ----------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'documents',
    'documents',
    false,
    52428800,  -- 50 MiB
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
  ),
  (
    'profile-images',
    'profile-images',
    false,
    5242880,   -- 5 MiB
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
  )
on conflict (id) do nothing;

-- --- Helper: extract the leading company_id segment from an object path ------
create or replace function public.storage_company_id(object_name text)
returns uuid
language sql
immutable
as $$
  -- storage.foldername() returns the path segments as a text[]; the first is
  -- our company_id convention. Returns null if it is not a valid uuid.
  select nullif((storage.foldername(object_name))[1], '')::uuid;
$$;

-- ===========================================================================
-- documents bucket policies (bucket_id = 'documents')
-- ===========================================================================
create policy "documents_read_company"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents'
    and public.storage_company_id(name) = public.current_company_id()
  );

create policy "documents_insert_company"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents'
    and public.storage_company_id(name) = public.current_company_id()
  );

create policy "documents_update_company"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'documents'
    and public.storage_company_id(name) = public.current_company_id()
  )
  with check (
    bucket_id = 'documents'
    and public.storage_company_id(name) = public.current_company_id()
  );

create policy "documents_delete_manager"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'documents'
    and public.storage_company_id(name) = public.current_company_id()
    and public.is_company_manager()
  );

-- ===========================================================================
-- profile-images bucket policies (bucket_id = 'profile-images')
-- ===========================================================================
-- Read: any company member may view profile images in their tenant.
create policy "profile_images_read_company"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'profile-images'
    and public.storage_company_id(name) = public.current_company_id()
  );

-- Write: a user may manage images under their own <company_id>/<user_id>/ path;
-- managers may manage any within the company.
create policy "profile_images_insert_self_or_manager"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile-images'
    and public.storage_company_id(name) = public.current_company_id()
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_company_manager()
    )
  );

create policy "profile_images_update_self_or_manager"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'profile-images'
    and public.storage_company_id(name) = public.current_company_id()
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_company_manager()
    )
  )
  with check (
    bucket_id = 'profile-images'
    and public.storage_company_id(name) = public.current_company_id()
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_company_manager()
    )
  );

create policy "profile_images_delete_self_or_manager"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'profile-images'
    and public.storage_company_id(name) = public.current_company_id()
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_company_manager()
    )
  );
