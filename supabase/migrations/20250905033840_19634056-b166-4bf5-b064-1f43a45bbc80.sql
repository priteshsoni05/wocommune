-- Allow public viewing of active services for helpanion directory
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Public can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Helpers can still manage their own services  
-- (This policy already exists, just ensuring it's clear)