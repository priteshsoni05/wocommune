-- Allow public to view active services from helpanions
CREATE POLICY "Public can view active services with helpanion profile" 
ON public.services 
FOR SELECT 
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = services.helper_id 
    AND p.status = 'active' 
    AND p.username IS NOT NULL 
    AND p.username <> ''
  )
);

-- Ensure availability slots are publicly viewable for active helpanions
DROP POLICY IF EXISTS "Anyone can view available slots of active helpers" ON public.availability_slots;
CREATE POLICY "Public can view availability slots" 
ON public.availability_slots 
FOR SELECT 
USING (
  is_available = true 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = availability_slots.helper_id 
    AND p.status = 'active' 
    AND p.username IS NOT NULL 
    AND p.username <> ''
  )
);