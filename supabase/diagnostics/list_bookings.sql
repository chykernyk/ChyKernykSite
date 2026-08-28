select date, status
from public.bookings
where status = 'booked'
order by date asc;
