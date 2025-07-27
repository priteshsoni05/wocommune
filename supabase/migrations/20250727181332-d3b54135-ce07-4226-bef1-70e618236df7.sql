-- Create table for custom dropdown options
CREATE TABLE public.custom_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  option_type text NOT NULL, -- 'school' or 'role'
  option_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, option_type, option_value)
);

-- Enable RLS
ALTER TABLE public.custom_options ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own custom options" 
ON public.custom_options 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom options" 
ON public.custom_options 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom options" 
ON public.custom_options 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom options" 
ON public.custom_options 
FOR DELETE 
USING (auth.uid() = user_id);

-- Also let's create an index for better performance
CREATE INDEX idx_custom_options_user_type ON public.custom_options(user_id, option_type);