-- Fix RLS policies to allow public access to individual helpanion profiles
-- This ensures that anyone can view a helpanion's profile without authentication

-- Drop the existing restrictive policy that's blocking individual profile access
DROP POLICY IF EXISTS "Public can view active profiles with usernames" ON public.profiles;

-- Create a new comprehensive policy that allows public access to active helpanion profiles
CREATE POLICY "Public can view active helpanion profiles" 
ON public.profiles 
FOR SELECT 
USING (
  status = 'active'::text 
  AND username IS NOT NULL 
  AND username <> ''::text 
  AND EXISTS (
    SELECT 1 
    FROM public.user_roles ur 
    WHERE ur.user_id = profiles.user_id 
    AND ur.role = 'helpanion'::app_role
  )
);

-- Also ensure services are accessible for public helpanion profiles
-- Update the existing policy to be more permissive
DROP POLICY IF EXISTS "Public can view active services with helpanion profile" ON public.services;

CREATE POLICY "Public can view helpanion services" 
ON public.services 
FOR SELECT 
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = services.helper_id 
    AND p.status = 'active'::text 
    AND p.username IS NOT NULL 
    AND p.username <> ''::text
    AND EXISTS (
      SELECT 1 
      FROM public.user_roles ur 
      WHERE ur.user_id = p.user_id 
      AND ur.role = 'helpanion'::app_role
    )
  )
);