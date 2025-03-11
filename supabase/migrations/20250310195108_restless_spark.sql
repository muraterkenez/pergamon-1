/*
  # Fix Animals Table RLS Policies

  1. Changes
    - Enable RLS on animals table
    - Set up proper RLS policies for CRUD operations
  
  2. Security
    - Allow authenticated users to perform all operations
    - Ensure proper policy ordering and permissions
*/

-- Enable RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Animals are viewable by authenticated users" ON animals;
DROP POLICY IF EXISTS "Animals are insertable by authenticated users" ON animals;
DROP POLICY IF EXISTS "Animals are updatable by authenticated users" ON animals;
DROP POLICY IF EXISTS "Animals are deletable by authenticated users" ON animals;

-- Create comprehensive policies for authenticated users
CREATE POLICY "Animals are viewable by authenticated users"
ON animals
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Animals are insertable by authenticated users"
ON animals
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Animals are updatable by authenticated users"
ON animals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Animals are deletable by authenticated users"
ON animals
FOR DELETE
TO authenticated
USING (true);