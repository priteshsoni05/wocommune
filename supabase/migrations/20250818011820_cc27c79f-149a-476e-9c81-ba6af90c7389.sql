-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public can view active profiles with username" ON profiles;
DROP POLICY IF EXISTS "Anyone can view active profiles with username" ON profiles;

-- Create a simple policy that allows anonymous and authenticated users to view active public profiles
CREATE POLICY "Allow public access to active profiles with username" 
ON profiles 
FOR SELECT 
TO anon, authenticated 
USING (status = 'active' AND username IS NOT NULL);