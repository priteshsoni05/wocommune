-- Migrate use_case field from text to text[] to support multiple expertise areas
-- First, create a temporary column to store the array values
ALTER TABLE public.profiles ADD COLUMN use_case_array text[];

-- Copy existing use_case values into the array (if not null)
UPDATE public.profiles 
SET use_case_array = ARRAY[use_case]::text[] 
WHERE use_case IS NOT NULL AND use_case != '';

-- Drop the old use_case column
ALTER TABLE public.profiles DROP COLUMN use_case;

-- Rename the new column to use_case
ALTER TABLE public.profiles RENAME COLUMN use_case_array TO use_case;