-- Add Google Calendar integration columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN google_calendar_id text,
ADD COLUMN calendar_integration_status text DEFAULT 'not_configured' CHECK (calendar_integration_status IN ('not_configured', 'connected', 'error'));