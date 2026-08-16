-- Committed calendar rates, edited on the admin-only Rates page and
-- read by every visitor's calendar. Publicly readable; writes are only
-- exposed to admins in the app's UI (not enforced by RLS, matching the
-- existing "pins"/"fishing_spots" tables' access model — this app has no
-- real server-side auth, only a client-side admin gate).
create table if not exists public.rates (
  season text primary key,
  tier text not null,
  rate numeric not null,
  updated_at timestamptz not null default now()
);

alter table public.rates enable row level security;

drop policy if exists "rates public read" on public.rates;
create policy "rates public read" on public.rates
  for select using (true);

drop policy if exists "rates public insert" on public.rates;
create policy "rates public insert" on public.rates
  for insert with check (true);

drop policy if exists "rates public update" on public.rates;
create policy "rates public update" on public.rates
  for update using (true);
