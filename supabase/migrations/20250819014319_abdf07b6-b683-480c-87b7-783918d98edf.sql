-- Drop all existing SELECT policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a single permissive SELECT policy that allows:
-- 1. Anyone to view active public profiles with usernames
-- 2. Users to view their own profiles
CREATE POLICY "profiles_select_policy" 
ON public.profiles 
FOR SELECT 
USING (
  -- Public profiles: active with username (anyone can view)
  (status = 'active' AND username IS NOT NULL AND username != '') 
  OR 
  -- Own profile: users can view their own profile
  (auth.uid() = user_id)
);