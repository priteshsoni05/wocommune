-- Drop the problematic policy
DROP POLICY "Public can view active helpanion profiles" ON public.profiles;

-- Create a simpler public policy for viewing active profiles with usernames
CREATE POLICY "Public can view active profiles with usernames" 
ON public.profiles 
FOR SELECT 
USING (
  status = 'active' AND 
  username IS NOT NULL AND 
  username != ''
);