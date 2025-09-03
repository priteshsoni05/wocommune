-- Create function to check if username is available
CREATE OR REPLACE FUNCTION public.is_username_available(_username text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE username = _username
  )
$$;

-- Create function to check if user has a specific role by email
CREATE OR REPLACE FUNCTION public.user_has_role(_email text, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN auth.users au ON ur.user_id = au.id
    WHERE au.email = _email
      AND ur.role = _role
  )
$$;

-- Create function to get user roles by email
CREATE OR REPLACE FUNCTION public.get_user_roles_by_email(_email text)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  JOIN auth.users au ON ur.user_id = au.id
  WHERE au.email = _email
$$;