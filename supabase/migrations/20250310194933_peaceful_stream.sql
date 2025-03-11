/*
  # Update RLS Policies for Animals Table

  1. Changes
    - Safely drop existing policies if they exist
    - Recreate policies with proper permissions
    - Ensure RLS is enabled
  
  2. Security
    - Maintain same security model:
      - Read: Anyone can read
      - Write operations: Authenticated users only
*/

-- First, ensure RLS is enabled
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies
DO $$ 
BEGIN
    -- Drop select policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'animals' 
        AND policyname = 'Anyone can read animals'
    ) THEN
        DROP POLICY "Anyone can read animals" ON animals;
    END IF;

    -- Drop insert policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'animals' 
        AND policyname = 'Authenticated users can insert animals'
    ) THEN
        DROP POLICY "Authenticated users can insert animals" ON animals;
    END IF;

    -- Drop update policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'animals' 
        AND policyname = 'Authenticated users can update animals'
    ) THEN
        DROP POLICY "Authenticated users can update animals" ON animals;
    END IF;

    -- Drop delete policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'animals' 
        AND policyname = 'Authenticated users can delete animals'
    ) THEN
        DROP POLICY "Authenticated users can delete animals" ON animals;
    END IF;
END $$;

-- Recreate policies
CREATE POLICY "Anyone can read animals"
    ON animals
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert animals"
    ON animals
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update animals"
    ON animals
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete animals"
    ON animals
    FOR DELETE
    TO authenticated
    USING (true);