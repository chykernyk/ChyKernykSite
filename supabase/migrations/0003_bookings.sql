-- Admin-set calendar booking overrides, layered on top of the app's
-- computed default availability. Publicly readable; writes are only
-- exposed to admins in the app's UI (not enforced by RLS, matching the
-- existing "pins"/"fishing_spots"/"rates" tables' access model — this
-- app has no real server-side auth, only a client-side admin gate).
create table if not exists public.bookings (
  date text primary key,
  status text not null,
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

drop policy if exists "bookings public read" on public.bookings;
create policy "bookings public read" on public.bookings
  for select using (true);

drop policy if exists "bookings public insert" on public.bookings;
create policy "bookings public insert" on public.bookings
  for insert with check (true);

drop policy if exists "bookings public update" on public.bookings;
create policy "bookings public update" on public.bookings
  for update using (true);
