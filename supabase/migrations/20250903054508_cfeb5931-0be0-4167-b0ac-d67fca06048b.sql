-- Add role column to profiles table for easy joining
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_active_role app_role;