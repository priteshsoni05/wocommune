-- Create reviews table for storing user reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  helper_id UUID NOT NULL,
  seeker_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_title TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Helpers can view their own reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() = helper_id);

CREATE POLICY "Seekers can create reviews for their bookings" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = seeker_id AND 
  EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.id = booking_id 
    AND b.seeker_id = auth.uid() 
    AND b.status = 'completed'
  )
);

CREATE POLICY "Seekers can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = seeker_id);

CREATE POLICY "Public can view reviews for active helpers" 
ON public.reviews 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = helper_id 
    AND p.status = 'active'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_reviews_helper_id ON public.reviews(helper_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);