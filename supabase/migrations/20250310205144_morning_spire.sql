/*
  # Fix Health Records Relationships

  1. Changes
    - Add foreign key relationship between health_records and users table
    - Update view permissions to include performer details

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access to joined user data
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Herkes sağlık kayıtlarını okuyabilir" ON health_records;

-- Create new policy with proper joins
CREATE POLICY "Herkes sağlık kayıtlarını okuyabilir"
ON health_records FOR SELECT
TO authenticated
USING (true);

-- Add foreign key relationship if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'health_records_performed_by_fkey'
  ) THEN
    ALTER TABLE health_records
    ADD CONSTRAINT health_records_performed_by_fkey
    FOREIGN KEY (performed_by)
    REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END $$;