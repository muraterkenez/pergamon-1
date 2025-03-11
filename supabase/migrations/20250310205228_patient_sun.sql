/*
  # Fix Health Records Relationships

  1. Changes
    - Add foreign key relationship between health_records and auth.users table
    - Update view permissions to include performer details
    - Drop and recreate policies to ensure proper access

  2. Security
    - Maintain RLS policies for data protection
    - Ensure proper access to joined user data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Herkes sağlık kayıtlarını okuyabilir" ON health_records;
DROP POLICY IF EXISTS "Herkes vücut kondisyon skorlarını okuyabilir" ON body_scores;
DROP POLICY IF EXISTS "Herkes biyogüvenlik kontrollerini okuyabilir" ON biosecurity_checks;
DROP POLICY IF EXISTS "Herkes aşı kayıtlarını okuyabilir" ON vaccinations;

-- Add foreign key relationship
ALTER TABLE health_records
DROP CONSTRAINT IF EXISTS health_records_performed_by_fkey;

ALTER TABLE health_records
ADD CONSTRAINT health_records_performed_by_fkey
FOREIGN KEY (performed_by)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Create policies with proper joins
CREATE POLICY "Herkes sağlık kayıtlarını okuyabilir"
ON health_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes vücut kondisyon skorlarını okuyabilir"
ON body_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes biyogüvenlik kontrollerini okuyabilir"
ON biosecurity_checks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes aşı kayıtlarını okuyabilir"
ON vaccinations FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON health_records TO authenticated;
GRANT SELECT ON body_scores TO authenticated;
GRANT SELECT ON biosecurity_checks TO authenticated;
GRANT SELECT ON vaccinations TO authenticated;