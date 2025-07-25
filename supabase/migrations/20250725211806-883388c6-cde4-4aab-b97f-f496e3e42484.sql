-- Fix RLS policies for bookings table - remove all INSERT policies and create one permissive one
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anonymous users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Seekers can create bookings" ON public.bookings;

-- Create a single, simple INSERT policy that allows all inserts
CREATE POLICY "Allow all bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);