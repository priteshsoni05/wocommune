-- Remove all authentication-related components step by step

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop policies that reference user_roles table
DROP POLICY IF EXISTS "Public can view helpanion services" ON public.services;

-- Drop all other RLS policies
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view active helpanion profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public can view helpanion roles" ON public.user_roles;

DROP POLICY IF EXISTS "Helpers can manage their own availability" ON public.availability_slots;
DROP POLICY IF EXISTS "Public can view availability for active helpers" ON public.availability_slots;
DROP POLICY IF EXISTS "Public can view availability slots" ON public.availability_slots;

DROP POLICY IF EXISTS "Authenticated users can create bookings as seeker" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Seekers can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view their own bookings" ON public.bookings;

DROP POLICY IF EXISTS "Users can view their own custom options" ON public.custom_options;
DROP POLICY IF EXISTS "Users can insert their own custom options" ON public.custom_options;
DROP POLICY IF EXISTS "Users can update their own custom options" ON public.custom_options;
DROP POLICY IF EXISTS "Users can delete their own custom options" ON public.custom_options;

DROP POLICY IF EXISTS "Authenticated helpers can view their own earnings" ON public.earnings;
DROP POLICY IF EXISTS "Only system can create earnings" ON public.earnings;
DROP POLICY IF EXISTS "Only system can update earnings" ON public.earnings;
DROP POLICY IF EXISTS "Only system can delete earnings" ON public.earnings;

DROP POLICY IF EXISTS "Helpers can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Seekers can create reviews for their bookings" ON public.reviews;
DROP POLICY IF EXISTS "Seekers can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view reviews for active helpers" ON public.reviews;

DROP POLICY IF EXISTS "Helpers can view their own services" ON public.services;
DROP POLICY IF EXISTS "Helpers can create their own services" ON public.services;
DROP POLICY IF EXISTS "Helpers can update their own services" ON public.services;
DROP POLICY IF EXISTS "Helpers can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Drop auth-related functions
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role);
DROP FUNCTION IF EXISTS public.get_user_roles(_user_id uuid);
DROP FUNCTION IF EXISTS public.get_user_roles_by_email(_email text);
DROP FUNCTION IF EXISTS public.is_username_available(_username text);
DROP FUNCTION IF EXISTS public.user_has_role(_email text, _role app_role);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop user-related tables
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.profiles;

-- Drop the app_role enum
DROP TYPE IF EXISTS public.app_role;