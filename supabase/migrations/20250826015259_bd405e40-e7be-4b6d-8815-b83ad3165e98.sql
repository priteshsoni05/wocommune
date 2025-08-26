-- Enable public read access for helpanion directory (remove authentication dependency)

-- Drop and recreate the public read policy for profiles to ensure it works without auth
DROP POLICY IF EXISTS "Public can view active helpanion profiles" ON public.profiles;

CREATE POLICY "Public can view active helpanion profiles"
ON public.profiles
FOR SELECT
USING (
  status = 'active' 
  AND username IS NOT NULL 
  AND username <> ''
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = profiles.user_id 
    AND ur.role = 'helpanion'
  )
);

-- Ensure public read access for helpanion roles
DROP POLICY IF EXISTS "Public can view helpanion roles" ON public.user_roles;

CREATE POLICY "Public can view helpanion roles"
ON public.user_roles
FOR SELECT
USING (role = 'helpanion');

-- Ensure public read access for helpanion services
DROP POLICY IF EXISTS "Public can view helpanion services" ON public.services;

CREATE POLICY "Public can view helpanion services"
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
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = p.user_id
      AND ur.role = 'helpanion'
    )
  )
);