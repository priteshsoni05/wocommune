-- Enable RLS on all existing tables
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for existing tables
-- Availability slots - helpers can manage their own slots
CREATE POLICY "Helpers can view all availability slots" 
ON public.availability_slots 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Helpers can manage their own availability slots" 
ON public.availability_slots 
FOR ALL 
TO authenticated
USING (helper_id = auth.uid());

-- Bookings - users can see bookings they're involved in
CREATE POLICY "Users can view their bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (helper_id = auth.uid() OR seeker_id = auth.uid());

CREATE POLICY "Seekers can create bookings" 
ON public.bookings 
FOR INSERT 
TO authenticated
WITH CHECK (seeker_id = auth.uid());

CREATE POLICY "Helpers can update their bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (helper_id = auth.uid());

-- Custom options - users can manage their own options
CREATE POLICY "Users can manage their own custom options" 
ON public.custom_options 
FOR ALL 
TO authenticated
USING (user_id = auth.uid());

-- Earnings - helpers can view their own earnings
CREATE POLICY "Helpers can view their own earnings" 
ON public.earnings 
FOR SELECT 
TO authenticated
USING (helper_id = auth.uid());

-- Reviews - public read, users can manage their own reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Seekers can create reviews for their bookings" 
ON public.reviews 
FOR INSERT 
TO authenticated
WITH CHECK (seeker_id = auth.uid());

-- Services - public read, helpers can manage their own services
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Helpers can manage their own services" 
ON public.services 
FOR ALL 
TO authenticated
USING (helper_id = auth.uid());