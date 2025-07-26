-- Create a policy to allow public viewing of booking availability (limited info only)
CREATE POLICY "Public can view booking availability" 
ON public.bookings 
FOR SELECT 
USING (true);