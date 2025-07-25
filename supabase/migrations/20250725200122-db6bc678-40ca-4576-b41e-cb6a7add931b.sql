-- Drop the conflicting policies and recreate them with proper permissions
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Helpers can manage their own services" ON public.services;

-- Create separate policies for different operations
-- Policy for helpers to view their own services (active and inactive)
CREATE POLICY "Helpers can view their own services" 
ON public.services 
FOR SELECT 
USING (auth.uid() = helper_id);

-- Policy for public to view only active services from other helpers
CREATE POLICY "Public can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true AND auth.uid() != helper_id);

-- Policy for helpers to create their own services
CREATE POLICY "Helpers can create their own services" 
ON public.services 
FOR INSERT 
WITH CHECK (auth.uid() = helper_id);

-- Policy for helpers to update their own services
CREATE POLICY "Helpers can update their own services" 
ON public.services 
FOR UPDATE 
USING (auth.uid() = helper_id);

-- Policy for helpers to delete their own services
CREATE POLICY "Helpers can delete their own services" 
ON public.services 
FOR DELETE 
USING (auth.uid() = helper_id);