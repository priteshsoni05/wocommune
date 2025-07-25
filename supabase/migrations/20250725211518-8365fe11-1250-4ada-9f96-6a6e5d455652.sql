-- Update RLS policies on bookings table to allow anonymous bookings
-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Seekers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Helpers can update their bookings" ON public.bookings;

-- Make seeker_id nullable to support anonymous bookings
ALTER TABLE public.bookings ALTER COLUMN seeker_id DROP NOT NULL;

-- Create new policies that support both authenticated and anonymous users
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = seeker_id OR 
    auth.uid() = helper_id
  )
);

CREATE POLICY "Helpers can view all their bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = helper_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = seeker_id OR 
    auth.uid() = helper_id
  )
);