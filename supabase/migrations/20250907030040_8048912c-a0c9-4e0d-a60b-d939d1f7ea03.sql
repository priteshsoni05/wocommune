-- Change the role column in profiles table from app_role enum to text for storing profession
ALTER TABLE public.profiles 
DROP COLUMN role;

-- Add a new profession column as text
ALTER TABLE public.profiles 
ADD COLUMN profession text;