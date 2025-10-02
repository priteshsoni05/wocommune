-- Add community guidelines acceptance tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN community_guidelines_accepted_at timestamp with time zone;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.community_guidelines_accepted_at IS 'Timestamp when user accepted community guidelines during signup';