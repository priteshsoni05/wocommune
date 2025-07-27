-- Delete user accounts: pritesh.soni03@gmail.com and spritesh25@gmail.com
-- First, get the user IDs for the emails we want to delete
DO $$
DECLARE
    user1_id uuid;
    user2_id uuid;
BEGIN
    -- Get user IDs from auth.users
    SELECT id INTO user1_id FROM auth.users WHERE email = 'pritesh.soni03@gmail.com';
    SELECT id INTO user2_id FROM auth.users WHERE email = 'spritesh25@gmail.com';
    
    -- Only proceed if users exist
    IF user1_id IS NOT NULL THEN
        -- Delete related data for user 1 in correct order
        DELETE FROM public.earnings WHERE helper_id = user1_id;
        DELETE FROM public.availability_slots WHERE helper_id = user1_id;
        DELETE FROM public.bookings WHERE helper_id = user1_id OR seeker_id = user1_id;
        DELETE FROM public.services WHERE helper_id = user1_id;
        DELETE FROM public.user_roles WHERE user_id = user1_id;
        DELETE FROM public.profiles WHERE user_id = user1_id;
        
        -- Delete the auth user (this will cascade any remaining references)
        DELETE FROM auth.users WHERE id = user1_id;
        
        RAISE NOTICE 'Deleted user: pritesh.soni03@gmail.com';
    ELSE
        RAISE NOTICE 'User pritesh.soni03@gmail.com not found';
    END IF;
    
    IF user2_id IS NOT NULL THEN
        -- Delete related data for user 2 in correct order
        DELETE FROM public.earnings WHERE helper_id = user2_id;
        DELETE FROM public.availability_slots WHERE helper_id = user2_id;
        DELETE FROM public.bookings WHERE helper_id = user2_id OR seeker_id = user2_id;
        DELETE FROM public.services WHERE helper_id = user2_id;
        DELETE FROM public.user_roles WHERE user_id = user2_id;
        DELETE FROM public.profiles WHERE user_id = user2_id;
        
        -- Delete the auth user (this will cascade any remaining references)
        DELETE FROM auth.users WHERE id = user2_id;
        
        RAISE NOTICE 'Deleted user: spritesh25@gmail.com';
    ELSE
        RAISE NOTICE 'User spritesh25@gmail.com not found';
    END IF;
END $$;