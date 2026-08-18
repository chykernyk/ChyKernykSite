-- One-off data fix: a visitor's book entry misspelled "Porthcurnick" as
-- "Portcurnick" (missing the h). Corrects it wherever it appears in the
-- message or name columns, case-sensitively for both common capitalisations.
update public.visitor_entries
set message = replace(replace(message, 'Portcurnick', 'Porthcurnick'), 'portcurnick', 'porthcurnick')
where message ilike '%portcurnick%' and message not ilike '%porthcurnick%';

update public.visitor_entries
set name = replace(replace(name, 'Portcurnick', 'Porthcurnick'), 'portcurnick', 'porthcurnick')
where name ilike '%portcurnick%' and name not ilike '%porthcurnick%';
