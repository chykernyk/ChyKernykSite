-- The calendar now starts from April 2027 — booking history before then
-- is retired and no longer browsable in the app. Removes the admin
-- override rows in the bookings table for dates before 1 April 2027,
-- leaving everything from that date onwards untouched.
delete from public.bookings
where date < '2027-04-01';
