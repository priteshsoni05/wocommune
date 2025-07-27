-- Add username field to profiles table for Helpanions
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Add a partial unique index for username (only when not null)
CREATE UNIQUE INDEX idx_profiles_username ON public.profiles (username) WHERE username IS NOT NULL;

-- Add last_active_role to track user's preferred role
ALTER TABLE public.profiles 
ADD COLUMN last_active_role text DEFAULT 'walker';

-- Update the update_updated_at trigger to work with profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();