-- Add missing use_case column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS use_case text;