-- Fix profile creation policy to ensure users can create their own profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also ensure we have proper select policy for user's own profile
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;

CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);