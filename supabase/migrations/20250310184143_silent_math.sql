/*
  # Initial Database Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - phone (text)
      - role (text)
      - status (text)
      - last_login (timestamp)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - animals
      - id (uuid, primary key)
      - national_id (text, unique)
      - name (text)
      - birth_date (date)
      - gender (text)
      - breed (text)
      - status (text)
      - group_type (text)
      - weight (numeric)
      - height (numeric)
      - body_condition_score (numeric)
      - lactation_number (integer)
      - welfare_score (numeric)
      - mother_id (uuid, foreign key)
      - father_id (uuid, foreign key)
      - reproductive_status (text)
      - last_insemination_date (date)
      - expected_calving_date (date)
      - rfid_tag (text)
      - image_url (text)
      - notes (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - milk_production
      - id (uuid, primary key)
      - animal_id (uuid, foreign key)
      - date (date)
      - session (text)
      - quantity (numeric)
      - fat_content (numeric)
      - protein_content (numeric)
      - temperature (numeric)
      - notes (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - health_records
      - id (uuid, primary key)
      - animal_id (uuid, foreign key)
      - record_date (date)
      - record_type (text)
      - diagnosis (text)
      - treatment (text)
      - medication (jsonb)
      - performed_by (uuid, foreign key)
      - follow_up_date (date)
      - notes (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - stock_items
      - id (uuid, primary key)
      - name (text)
      - category (text)
      - sku (text, unique)
      - barcode (text)
      - unit (text)
      - quantity (numeric)
      - min_quantity (numeric)
      - max_quantity (numeric)
      - location (text)
      - price (numeric)
      - expiry_date (date)
      - description (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Milk Production table
CREATE TABLE IF NOT EXISTS milk_production (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  date date NOT NULL,
  session text NOT NULL,
  quantity numeric NOT NULL,
  fat_content numeric,
  protein_content numeric,
  temperature numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health Records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  record_date date NOT NULL,
  record_type text NOT NULL,
  diagnosis text,
  treatment text,
  medication jsonb,
  performed_by uuid REFERENCES users(id) NOT NULL,
  follow_up_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stock Items table
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view all animals"
  ON animals
  FOR SELECT
  TO authenticated
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
  USING (true);

CREATE POLICY "Authenticated users can view milk production"
  ON milk_production
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert milk production"
  ON milk_production
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view health records"
  ON health_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert health records"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view stock items"
  ON stock_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update stock items"
  ON stock_items
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_animals_national_id ON animals(national_id);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);
CREATE INDEX IF NOT EXISTS idx_milk_production_animal_date ON milk_production(animal_id, date);
CREATE INDEX IF NOT EXISTS idx_health_records_animal_date ON health_records(animal_id, record_date);
CREATE INDEX IF NOT EXISTS idx_stock_items_sku ON stock_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_items_category ON stock_items(category);