create extension if not exists pgcrypto;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service text not null,
  modality text not null,
  preferred_date date not null,
  preferred_time text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  message text,
  consent boolean not null,
  language text not null default 'en'
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  language text not null default 'en'
);

alter table public.bookings enable row level security;
alter table public.messages enable row level security;

create policy "anon can insert bookings" on public.bookings
  for insert to anon
  with check (true);

create policy "anon can insert messages" on public.messages
  for insert to anon
  with check (true);

-- Intentionally no SELECT/UPDATE/DELETE policy for anon: RLS default-deny
-- means the public anon key can write but never read, modify, or delete
-- rows. Staff read submissions via the Supabase dashboard (authenticated).
