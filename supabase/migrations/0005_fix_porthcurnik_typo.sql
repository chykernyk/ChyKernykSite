-- One-off data fix: a visitor's book entry misspelled "Porthcurnick" as
-- "Porthcurnik" (missing the final c). Corrects it wherever it appears in
-- the message or name columns, for both common capitalisations.
update public.visitor_entries
set message = replace(replace(message, 'Porthcurnik', 'Porthcurnick'), 'porthcurnik', 'porthcurnick')
where message ilike '%porthcurnik%';

update public.visitor_entries
set name = replace(replace(name, 'Porthcurnik', 'Porthcurnick'), 'porthcurnik', 'porthcurnick')
where name ilike '%porthcurnik%';
