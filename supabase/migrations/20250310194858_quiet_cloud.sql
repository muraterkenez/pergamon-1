/*
  # Add RLS Policies for Animals Table

  1. Security Changes
    - Enable RLS on animals table
    - Add policies for CRUD operations:
      - Select: Users can read all animals
      - Insert: Authenticated users can insert animals
      - Update: Authenticated users can update animals
      - Delete: Authenticated users can delete animals
*/

-- Enable RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Policy for reading animals (all users can read)
CREATE POLICY "Anyone can read animals"
  ON animals
  FOR SELECT
  USING (true);

-- Policy for inserting animals (authenticated users only)
CREATE POLICY "Authenticated users can insert animals"
  ON animals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for updating animals (authenticated users only)
CREATE POLICY "Authenticated users can update animals"
  ON animals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for deleting animals (authenticated users only)
CREATE POLICY "Authenticated users can delete animals"
  ON animals
  FOR DELETE
  TO authenticated
  USING (true);