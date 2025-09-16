-- Add mode and outcomes columns to services table
ALTER TABLE public.services 
ADD COLUMN mode TEXT,
ADD COLUMN outcomes TEXT;