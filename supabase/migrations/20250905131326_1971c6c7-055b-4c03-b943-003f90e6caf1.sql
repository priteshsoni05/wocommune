-- Add a short_bio field to the profiles table for a one-line tagline
ALTER TABLE public.profiles 
ADD COLUMN short_bio TEXT;

-- Add a comment to describe the purpose
COMMENT ON COLUMN public.profiles.short_bio IS 'Short one-line bio/tagline that appears below the name on public profile';