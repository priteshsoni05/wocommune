-- Add DELETE policy for helpers to delete their own bookings
CREATE POLICY "Helpers can delete their bookings" 
ON public.bookings 
FOR DELETE
USING (helper_id = auth.uid());