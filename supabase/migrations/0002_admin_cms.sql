-- Admin CMS: lets an authenticated admin override site text, images, and
-- theme (colors/fonts) at runtime, without touching code. Every table is
-- publicly readable (the site needs the overrides to render) but only
-- writable by rows present in admin_profiles. There is no public sign-up —
-- admin accounts are created out-of-band with scripts/create-admin.mjs.

-- 1. Admin allowlist -----------------------------------------------------
-- A Supabase Auth user can edit content only if a matching row exists here.
create table if not exists admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table admin_profiles enable row level security;

create policy "admin can read own profile"
  on admin_profiles for select
  using (auth.uid() = user_id);

-- 2. Text content overrides ----------------------------------------------
-- Keyed exactly like the i18n dictionaries (e.g. "home.hero.title") or,
-- for blog posts, "blog.<slug>.title" / "blog.<slug>.excerpt" / "blog.<slug>.body".
-- A null/missing row means "use the built-in default text".
create table if not exists content_overrides (
  key text primary key,
  value_fr text,
  value_en text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table content_overrides enable row level security;

create policy "anyone can read content overrides"
  on content_overrides for select
  using (true);

create policy "admins can insert content overrides"
  on content_overrides for insert
  with check (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can update content overrides"
  on content_overrides for update
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can delete content overrides"
  on content_overrides for delete
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

-- 3. Media (image) overrides ----------------------------------------------
-- Keyed by a named "slot" (e.g. "home.hero.slide1", "home.intro.portrait").
-- Deleting a row reverts that slot to its built-in default image.
create table if not exists media_overrides (
  slot_key text primary key,
  url text not null,
  alt_fr text,
  alt_en text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table media_overrides enable row level security;

create policy "anyone can read media overrides"
  on media_overrides for select
  using (true);

create policy "admins can insert media overrides"
  on media_overrides for insert
  with check (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can update media overrides"
  on media_overrides for update
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can delete media overrides"
  on media_overrides for delete
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

-- 4. Site theme (colors & fonts) ------------------------------------------
-- Single row, id='default'. colors/fonts are small JSON objects consumed by
-- src/theme/ThemeProvider.jsx. Deleting the row reverts to the built-in
-- default palette/fonts.
create table if not exists site_theme (
  id text primary key default 'default',
  colors jsonb,
  fonts jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table site_theme enable row level security;

create policy "anyone can read site theme"
  on site_theme for select
  using (true);

create policy "admins can insert site theme"
  on site_theme for insert
  with check (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can update site theme"
  on site_theme for update
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can delete site theme"
  on site_theme for delete
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

-- 5. Storage bucket for uploaded images -----------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

create policy "anyone can read site-media"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "admins can upload site-media"
  on storage.objects for insert
  with check (
    bucket_id = 'site-media'
    and exists (select 1 from admin_profiles where user_id = auth.uid())
  );

create policy "admins can update site-media"
  on storage.objects for update
  using (
    bucket_id = 'site-media'
    and exists (select 1 from admin_profiles where user_id = auth.uid())
  );

create policy "admins can delete site-media"
  on storage.objects for delete
  using (
    bucket_id = 'site-media'
    and exists (select 1 from admin_profiles where user_id = auth.uid())
  );
