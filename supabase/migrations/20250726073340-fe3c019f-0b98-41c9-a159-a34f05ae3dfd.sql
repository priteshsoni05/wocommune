-- Add unique constraint to prevent double bookings for the same helper, date, and time
ALTER TABLE bookings 
ADD CONSTRAINT unique_helper_datetime 
UNIQUE (helper_id, booking_date, start_time);

-- Add index for better performance when checking slot availability
CREATE INDEX IF NOT EXISTS idx_bookings_helper_date_time 
ON bookings (helper_id, booking_date, start_time, end_time) 
WHERE status IN ('pending', 'confirmed');