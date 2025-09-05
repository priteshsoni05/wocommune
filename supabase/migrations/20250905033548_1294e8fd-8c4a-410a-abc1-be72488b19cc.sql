-- Allow public viewing of helpanion roles since helpanion profiles should be publicly discoverable
CREATE POLICY "Anyone can view helpanion roles" 
ON public.user_roles 
FOR SELECT 
USING (role = 'helpanion');