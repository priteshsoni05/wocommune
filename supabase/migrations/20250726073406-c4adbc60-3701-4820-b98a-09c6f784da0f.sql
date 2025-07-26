-- First, let's delete duplicate bookings (keeping the most recent one)
DELETE FROM bookings 
WHERE id NOT IN (
  SELECT DISTINCT ON (helper_id, booking_date, start_time) id
  FROM bookings 
  ORDER BY helper_id, booking_date, start_time, created_at DESC
);

-- Now add the unique constraint to prevent future double bookings
ALTER TABLE bookings 
ADD CONSTRAINT unique_helper_datetime 
UNIQUE (helper_id, booking_date, start_time);

-- Add index for better performance when checking slot availability
CREATE INDEX IF NOT EXISTS idx_bookings_helper_date_time 
ON bookings (helper_id, booking_date, start_time, end_time) 
WHERE status IN ('pending', 'confirmed');