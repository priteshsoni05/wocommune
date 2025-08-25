-- Fix earnings table RLS policy to require authentication and prevent anonymous access
-- This ensures only authenticated helpers can view their own earnings data

-- Drop the existing policy that allows anonymous access
DROP POLICY IF EXISTS "Helpers can view their own earnings" ON public.earnings;

-- Create a new secure policy that requires authentication
CREATE POLICY "Authenticated helpers can view their own earnings" 
ON public.earnings 
FOR SELECT 
TO authenticated 
USING (auth.uid() = helper_id);

-- Also ensure that earnings can only be created by the system (not by users)
-- Create a policy for INSERT that only allows service role for automated earnings creation
CREATE POLICY "Only system can create earnings" 
ON public.earnings 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- For good measure, ensure UPDATE and DELETE are also restricted to system/admin roles only
CREATE POLICY "Only system can update earnings" 
ON public.earnings 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Only system can delete earnings" 
ON public.earnings 
FOR DELETE 
TO service_role 
USING (true);