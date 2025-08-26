-- Delete user data for all users except nirali and pritesh
-- First delete dependent data in correct order to avoid foreign key violations

-- Get the user IDs we want to keep
-- nirali: 73837b7f-0ec9-4026-a2e4-fa51aecd738a 
-- pritesh: 75b5b63c-1308-492a-9795-d426042d9815

-- Delete bookings for users we want to remove (as either seeker or helper)
DELETE FROM bookings 
WHERE helper_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815')
   OR seeker_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete earnings for users we want to remove
DELETE FROM earnings 
WHERE helper_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete services for users we want to remove
DELETE FROM services 
WHERE helper_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete availability slots for users we want to remove
DELETE FROM availability_slots 
WHERE helper_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete custom options for users we want to remove
DELETE FROM custom_options 
WHERE user_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete user roles for users we want to remove
DELETE FROM user_roles 
WHERE user_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');

-- Delete profiles for users we want to remove
DELETE FROM profiles 
WHERE user_id NOT IN ('73837b7f-0ec9-4026-a2e4-fa51aecd738a', '75b5b63c-1308-492a-9795-d426042d9815');