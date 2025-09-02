-- Add username field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Add index for better performance on username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add constraint to ensure username follows a valid format (alphanumeric and underscores only)
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format_check 
CHECK (username ~ '^[a-zA-Z0-9_]+$');

-- Add constraint for minimum username length
ALTER TABLE public.profiles 
ADD CONSTRAINT username_length_check 
CHECK (char_length(username) >= 3 AND char_length(username) <= 30);