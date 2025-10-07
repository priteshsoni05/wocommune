-- Allow public/anonymous users to view availability slots
-- This is necessary so that non-authenticated users can see when helpanions are available for booking

CREATE POLICY "Public can view availability slots"
ON public.availability_slots
FOR SELECT
TO anon, authenticated
USING (is_available = true);

-- Allow public/anonymous users to view bookings (needed to show which time slots are already booked)
-- Only expose minimal information needed for slot availability checking
CREATE POLICY "Public can view booking times for slot checking"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (status IN ('pending', 'confirmed'));