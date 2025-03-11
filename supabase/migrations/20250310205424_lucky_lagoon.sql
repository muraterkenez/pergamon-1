/*
  # Fix User Details View

  1. Changes
    - Drop and recreate user_details view with correct column names from auth.users
    - Update view permissions for authenticated users

  2. Security
    - Maintain limited access to user details
    - Only expose necessary user information
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.user_details;

-- Create view with correct columns from auth.users
CREATE OR REPLACE VIEW public.user_details AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_details TO authenticated;

-- Add comment
COMMENT ON VIEW public.user_details IS 'Safe view of user details for joins';