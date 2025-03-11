/*
  # Fix Vaccination Policy

  1. Changes
    - Drop existing policy
    - Recreate policy with correct settings

  2. Security
    - Maintain same access rules
    - Only authenticated users can read vaccination records
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Herkes aşı kayıtlarını okuyabilir" ON vaccinations;

-- Create new policy
CREATE POLICY "Herkes aşı kayıtlarını okuyabilir"
ON vaccinations FOR SELECT
TO authenticated
USING (true);