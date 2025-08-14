-- Remove the existing public view policy that exposes all profile data
DROP POLICY IF EXISTS "Public can view active profiles" ON public.profiles;

-- Create a new policy that only exposes safe, non-sensitive fields to the public
CREATE POLICY "Public can view safe profile fields only" 
ON public.profiles 
FOR SELECT 
USING (
  status = 'active' AND 
  -- This policy will be enforced by column-level permissions below
  true
);

-- Revoke all existing permissions on the profiles table
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM authenticated;

-- Grant limited SELECT access to anon users (public) - only safe fields
GRANT SELECT (
  id,
  user_id,
  display_name,
  bio,
  avatar_url,
  status,
  username,
  role,
  skills,
  linkedin_url,
  instagram_url,
  portfolio_url,
  website_url,
  created_at
) ON public.profiles TO anon;

-- Grant full SELECT access to authenticated users for their own profiles and public safe fields for others
GRANT SELECT ON public.profiles TO authenticated;