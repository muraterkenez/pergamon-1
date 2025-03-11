/*
  # Initial Schema Setup

  1. Tables
    - animals
    - milk_sessions
    - milk_records
    - health_records
    - stock_items
    - tasks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Animals Table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id text UNIQUE NOT NULL,
  name text,
  birth_date date NOT NULL,
  gender text NOT NULL,
  breed text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  group_type text NOT NULL,
  weight numeric,
  height numeric,
  body_condition_score numeric,
  lactation_number integer DEFAULT 0,
  welfare_score numeric,
  mother_id uuid REFERENCES animals(id),
  father_id uuid REFERENCES animals(id),
  reproductive_status text,
  last_insemination_date date,
  expected_calving_date date,
  rfid_tag text,
  image_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milk Sessions Table
CREATE TABLE IF NOT EXISTS milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL,
  session_type text NOT NULL,
  start_time timestamptz,
  end_time timestamptz,
  total_milk numeric,
  milker_id uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milk Records Table
CREATE TABLE IF NOT EXISTS milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id),
  quantity numeric NOT NULL,
  temperature numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id),
  record_date date NOT NULL,
  record_type text NOT NULL,
  diagnosis text,
  treatment text,
  medication jsonb,
  performed_by uuid REFERENCES auth.users(id),
  follow_up_date date,
  priority text DEFAULT 'medium',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stock Items Table
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sku text UNIQUE NOT NULL,
  barcode text,
  unit text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  min_quantity numeric NOT NULL DEFAULT 0,
  max_quantity numeric,
  location text,
  price numeric NOT NULL DEFAULT 0,
  expiry_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to uuid REFERENCES auth.users(id),
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow authenticated users to read animals"
  ON animals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert animals"
  ON animals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update animals"
  ON animals FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read milk sessions"
  ON milk_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert milk sessions"
  ON milk_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update milk sessions"
  ON milk_sessions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read milk records"
  ON milk_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert milk records"
  ON milk_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update milk records"
  ON milk_records FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read stock items"
  ON stock_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert stock items"
  ON stock_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update stock items"
  ON stock_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS animals_status_idx ON animals(status);
CREATE INDEX IF NOT EXISTS animals_group_type_idx ON animals(group_type);
CREATE INDEX IF NOT EXISTS milk_sessions_date_idx ON milk_sessions(session_date);
CREATE INDEX IF NOT EXISTS health_records_date_idx ON health_records(record_date);
CREATE INDEX IF NOT EXISTS stock_items_category_idx ON stock_items(category);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);