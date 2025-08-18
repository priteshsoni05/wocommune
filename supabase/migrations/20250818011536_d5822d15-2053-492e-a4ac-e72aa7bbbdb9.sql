-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Anyone can view active public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view safe profile fields only" ON public.profiles;

-- Create a single clear policy for public profile access
CREATE POLICY "Public can view active profiles with username" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (status = 'active' AND username IS NOT NULL);

-- Keep the existing user policies
-- These should already exist:
-- "Users can view their own profile"
-- "Users can update their own profile" 
-- "Users can insert their own profile"