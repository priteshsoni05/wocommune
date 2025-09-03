-- Create a profile for the existing user who has a role but no profile
INSERT INTO public.profiles (user_id, display_name, email, username) 
VALUES (
  'ab6f44b1-9c71-438e-ba06-6f57966dd139'::uuid, 
  'pritesh', 
  'pritesh.soni03@gmail.com',
  'pritesh'
) ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  username = EXCLUDED.username;