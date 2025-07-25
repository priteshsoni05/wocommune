-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Create policies for service image uploads
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

CREATE POLICY "Users can upload service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'service-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their service images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'service-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their service images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'service-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image_url column to services table
ALTER TABLE public.services ADD COLUMN image_url TEXT;