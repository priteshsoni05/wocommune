-- Add meeting_link column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN meeting_link text,
ADD COLUMN calendar_event_id text;