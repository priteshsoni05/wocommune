-- Drop the existing problematic policy and create a new one that definitely allows anonymous access
DROP POLICY IF EXISTS "Allow public access to active profiles with username" ON public.profiles;

-- Create a new policy that explicitly allows anonymous and authenticated users to view active profiles with usernames
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (
  status = 'active' 
  AND username IS NOT NULL 
  AND username != ''
);