/*
  # Fix Health Records Schema

  1. Changes
    - Add performed_by column to health_records table
    - Update RLS policies

  2. Security
    - Update RLS policies for the new column
*/

-- Add performed_by column
ALTER TABLE health_records 
ADD COLUMN IF NOT EXISTS performed_by uuid REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view health records" ON health_records;
DROP POLICY IF EXISTS "Users can insert health records" ON health_records;
DROP POLICY IF EXISTS "Users can update health records" ON health_records;

CREATE POLICY "Users can view health records"
  ON health_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert health records"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = performed_by);

CREATE POLICY "Users can update health records"
  ON health_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = performed_by)
  WITH CHECK (auth.uid() = performed_by);