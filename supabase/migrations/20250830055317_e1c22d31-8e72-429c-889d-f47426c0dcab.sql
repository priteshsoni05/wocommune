-- First, ensure we have proper constraints for multi-role support
-- Add unique constraint on (user_id, role) to prevent duplicate role assignments
ALTER TABLE public.user_roles 
ADD CONSTRAINT unique_user_role 
UNIQUE (user_id, role);

-- Add unique constraint on username in profiles table for Helpanions
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_username 
UNIQUE (username);

-- Update the handle_new_user function to not automatically assign walker role
-- Users will now explicitly choose their role during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile without assigning a default role
  -- Role will be assigned during the signup flow
  INSERT INTO public.profiles (user_id, display_name, email, status)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.email,
    'active'
  );
  
  RETURN NEW;
END;
$$;

-- Create function to get user roles for login flow
CREATE OR REPLACE FUNCTION public.get_user_roles_by_email(_email text)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE u.email = _email
$$;

-- Create function to check if username exists (for Helpanion signup)
CREATE OR REPLACE FUNCTION public.is_username_available(_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE username = _username 
    AND username IS NOT NULL 
    AND username != ''
  )
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(_email text, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE u.email = _email
    AND ur.role = _role
  )
$$;