-- Update RLS policy to allow public access to helpanion profiles with all fields
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;

-- Create a more permissive policy for public profiles
CREATE POLICY "Public can view active helpanion profiles" 
ON public.profiles 
FOR SELECT 
USING (
  status = 'active' 
  AND username IS NOT NULL 
  AND username <> ''
  AND user_id IN (
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'helpanion'
  )
);

-- Allow users to view their own profiles (all data)
CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);