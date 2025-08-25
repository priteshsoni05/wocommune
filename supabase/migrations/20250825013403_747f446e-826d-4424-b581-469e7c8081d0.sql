-- Fix bookings table RLS policies to protect customer contact information
-- This ensures only authenticated users involved in the booking can access sensitive data

-- Drop all existing potentially insecure policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Helpers can view all their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all bookings" ON public.bookings;

-- Create secure policies that require authentication and proper authorization

-- 1. SELECT: Only authenticated users who are involved in the booking (seeker or helper)
CREATE POLICY "Authenticated users can view their own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = seeker_id OR auth.uid() = helper_id)
);

-- 2. INSERT: Only authenticated users can create bookings, and they must be the seeker
CREATE POLICY "Authenticated users can create bookings as seeker" 
ON public.bookings 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = seeker_id
);

-- 3. UPDATE: Only authenticated users involved in the booking can update it
CREATE POLICY "Authenticated users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = seeker_id OR auth.uid() = helper_id)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = seeker_id OR auth.uid() = helper_id)
);

-- 4. DELETE: Only the seeker can delete their booking (helpers cannot delete)
CREATE POLICY "Seekers can delete their own bookings" 
ON public.bookings 
FOR DELETE 
TO authenticated 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = seeker_id
);