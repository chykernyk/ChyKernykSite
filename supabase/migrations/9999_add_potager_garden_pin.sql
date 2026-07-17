-- One-off data insert, not a schema change. Adds the Potager Garden pin to
-- the Explore map, at its public address (High Cross, Constantine,
-- Falmouth, TR11 5RF) since the exact on-the-day GPS location wasn't
-- available to the session that added it.
insert into public.pins (label, link_type, link_id, category, lat, lng)
values ('Potager Garden', 'eating-out', 'potager-garden', 'Eating Out', 50.118835, -5.156546);
