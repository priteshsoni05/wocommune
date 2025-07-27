-- Add username field to profiles table for Helpanions
ALTER TABLE public.profiles 
ADD COLUMN username text;

-- Add a partial unique index for username (only when not null)
CREATE UNIQUE INDEX idx_profiles_username ON public.profiles (username) WHERE username IS NOT NULL;

-- Add last_active_role to track user's preferred role
ALTER TABLE public.profiles 
ADD COLUMN last_active_role text DEFAULT 'walker';