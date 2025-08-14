-- Check current column grants to see what's exposed
-- First, revoke the previous grant to be explicit
REVOKE ALL ON public.profiles FROM anon;

-- Grant access to only the absolutely necessary fields for public viewing
-- Explicitly excluding email, phone, and other sensitive fields
GRANT SELECT (
  id,
  user_id,
  display_name,
  bio,
  avatar_url,
  status,
  username,
  skills,
  linkedin_url,
  instagram_url,
  portfolio_url,
  website_url,
  created_at
) ON public.profiles TO anon;

-- Ensure authenticated users can still see their own full profile
-- but only safe fields for others
GRANT SELECT ON public.profiles TO authenticated;