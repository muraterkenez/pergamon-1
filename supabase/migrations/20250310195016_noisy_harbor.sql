/*
  # Fix Animals Table RLS Policies

  1. Changes
    - Enable RLS on animals table
    - Set up proper RLS policies for CRUD operations
  
  2. Security
    - Allow public read access
    - Restrict write operations to authenticated users
    - Ensure proper policy ordering and permissions
*/

-- Enable RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON animals;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON animals;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON animals;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON animals;

-- Create new policies with proper permissions
CREATE POLICY "Enable read access for all users" 
ON animals FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for authenticated users" 
ON animals FOR INSERT 
TO authenticated 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" 
ON animals FOR UPDATE 
TO authenticated 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" 
ON animals FOR DELETE 
TO authenticated 
USING (auth.role() = 'authenticated');