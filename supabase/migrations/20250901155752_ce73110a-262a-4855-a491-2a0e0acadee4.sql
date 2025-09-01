-- First, manually create the missing profile for the existing user
INSERT INTO public.profiles (user_id, display_name, email, status, last_active_role)
VALUES (
  '3c0c651d-7db7-4f56-80cb-25d98c7fc111',
  'Mayank Bajaj',
  'mayankbajaj.ca@gmail.com',
  'active',
  'helpanion'
) ON CONFLICT (user_id) DO NOTHING;

-- Also add the helpanion role if it doesn't exist
INSERT INTO public.user_roles (user_id, role)
VALUES ('3c0c651d-7db7-4f56-80cb-25d98c7fc111', 'helpanion')
ON CONFLICT (user_id, role) DO NOTHING;