-- Update RLS policies to allow public viewing of profiles and active services

-- Create policy to allow public viewing of profiles
CREATE POLICY "Public can view active profiles" 
ON public.profiles 
FOR SELECT 
USING (status = 'active');

-- Update the existing services policy to allow public to view active services without authentication
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

CREATE POLICY "Public can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Create policy to allow public viewing of availability slots for active helpers
CREATE POLICY "Public can view availability for active helpers" 
ON public.availability_slots 
FOR SELECT 
USING (
  is_available = true AND 
  helper_id IN (
    SELECT user_id FROM public.profiles WHERE status = 'active'
  )
);