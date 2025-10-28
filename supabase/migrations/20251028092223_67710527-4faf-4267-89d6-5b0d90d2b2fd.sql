-- Add employed_at field and visibility toggle to profiles table
ALTER TABLE public.profiles 
ADD COLUMN employed_at text,
ADD COLUMN show_employed_at boolean DEFAULT true;