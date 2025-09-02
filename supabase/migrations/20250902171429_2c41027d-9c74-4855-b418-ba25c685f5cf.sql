-- Clean up all user data from the database
-- This will remove all existing users and their associated data

-- Delete all user roles
DELETE FROM public.user_roles;

-- Delete all profiles
DELETE FROM public.profiles;

-- Delete all bookings
DELETE FROM public.bookings;

-- Delete all reviews  
DELETE FROM public.reviews;

-- Delete all earnings
DELETE FROM public.earnings;

-- Delete all services
DELETE FROM public.services;

-- Delete all availability slots
DELETE FROM public.availability_slots;

-- Delete all custom options
DELETE FROM public.custom_options;

-- Delete all users from auth.users (this is the main auth table)
-- Note: This requires special permissions and may need to be done through Supabase dashboard
-- But we'll try it here first
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users and delete them
    FOR user_record IN SELECT id FROM auth.users LOOP
        -- Delete the user (this should cascade to related tables)
        DELETE FROM auth.users WHERE id = user_record.id;
    END LOOP;
END $$;