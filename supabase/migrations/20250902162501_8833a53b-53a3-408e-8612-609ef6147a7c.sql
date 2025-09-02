-- Remove all authentication-related tables and policies

-- Drop triggers first (before functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop auth-related functions
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role);
DROP FUNCTION IF EXISTS public.get_user_roles(_user_id uuid);
DROP FUNCTION IF EXISTS public.get_user_roles_by_email(_email text);
DROP FUNCTION IF EXISTS public.is_username_available(_username text);
DROP FUNCTION IF EXISTS public.user_has_role(_email text, _role app_role);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop all RLS policies from all tables
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view active helpanion profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public can view helpanion roles" ON public.user_roles;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Drop user-related tables
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.profiles;

-- Drop the app_role enum
DROP TYPE IF EXISTS public.app_role;