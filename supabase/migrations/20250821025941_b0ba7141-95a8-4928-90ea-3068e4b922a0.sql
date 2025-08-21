-- Create a public policy to allow reading helpanion roles for profile discovery
CREATE POLICY "Public can view helpanion roles" 
ON public.user_roles 
FOR SELECT 
USING (role = 'helpanion');