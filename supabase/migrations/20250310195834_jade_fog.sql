/*
  # Milk Production Schema

  1. New Tables
    - `milk_sessions`
      - `id` (uuid, primary key)
      - `session_date` (date)
      - `session_type` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `total_milk` (numeric)
      - `milker_id` (uuid, references auth.users)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_records`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references milk_sessions)
      - `animal_id` (uuid, references animals)
      - `quantity` (numeric)
      - `temperature` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS milk_records CASCADE;
DROP TABLE IF EXISTS milk_sessions CASCADE;

-- Create milk_sessions table
CREATE TABLE milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  session_type text NOT NULL CHECK (session_type IN ('morning', 'evening')),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  total_milk numeric,
  milker_id uuid REFERENCES auth.users(id) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milk_records table
CREATE TABLE milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) NOT NULL,
  animal_id uuid REFERENCES animals(id) NOT NULL,
  quantity numeric NOT NULL CHECK (quantity >= 0),
  temperature numeric CHECK (temperature > 0 AND temperature < 45),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;

-- Create policies for milk_sessions
CREATE POLICY "Users can view all milk sessions"
  ON milk_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert milk sessions"
  ON milk_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = milker_id);

CREATE POLICY "Users can update own milk sessions"
  ON milk_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = milker_id)
  WITH CHECK (auth.uid() = milker_id);

-- Create policies for milk_records
CREATE POLICY "Users can view all milk records"
  ON milk_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert milk records"
  ON milk_records
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM milk_sessions
    WHERE id = milk_records.session_id
    AND milker_id = auth.uid()
  ));

CREATE POLICY "Users can update milk records"
  ON milk_records
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM milk_sessions
    WHERE id = milk_records.session_id
    AND milker_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM milk_sessions
    WHERE id = milk_records.session_id
    AND milker_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX idx_milk_sessions_date ON milk_sessions(session_date);
CREATE INDEX idx_milk_sessions_milker ON milk_sessions(milker_id);
CREATE INDEX idx_milk_records_session ON milk_records(session_id);
CREATE INDEX idx_milk_records_animal ON milk_records(animal_id);