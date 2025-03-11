/*
  # Süt Üretimi Tabloları - Düzeltme

  1. Yeni Tablolar
    - `milk_sessions`: Sağım seansları
      - `id` (uuid, primary key)
      - `session_date` (date)
      - `session_type` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `milker_id` (uuid)
      - `total_milk` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_records`: Sağım kayıtları
      - `id` (uuid, primary key)
      - `session_id` (uuid)
      - `animal_id` (uuid)
      - `quantity` (numeric)
      - `temperature` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_quality_tests`: Süt kalite testleri
      - `id` (uuid, primary key)
      - `session_id` (uuid)
      - `fat_content` (numeric)
      - `protein_content` (numeric)
      - `lactose_content` (numeric)
      - `somatic_cell_count` (numeric)
      - `bacterial_count` (numeric)
      - `test_date` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_tanks`: Süt tankları
      - `id` (uuid, primary key)
      - `name` (text)
      - `capacity` (numeric)
      - `current_amount` (numeric)
      - `temperature` (numeric)
      - `last_collection` (timestamptz)
      - `next_collection` (timestamptz)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS etkinleştirildi
    - Yetkilendirilmiş kullanıcılar için CRUD politikaları eklendi
*/

-- Sağım seansları tablosu
CREATE TABLE IF NOT EXISTS milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('morning', 'evening')),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  milker_id uuid REFERENCES auth.users(id),
  total_milk numeric(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sağım kayıtları tablosu
CREATE TABLE IF NOT EXISTS milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  quantity numeric(10,2) NOT NULL,
  temperature numeric(4,1),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt kalite testleri tablosu
CREATE TABLE IF NOT EXISTS milk_quality_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  fat_content numeric(4,2),
  protein_content numeric(4,2),
  lactose_content numeric(4,2),
  somatic_cell_count numeric(10,2),
  bacterial_count numeric(10,2),
  test_date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt tankları tablosu
CREATE TABLE IF NOT EXISTS milk_tanks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity numeric(10,2) NOT NULL,
  current_amount numeric(10,2) DEFAULT 0,
  temperature numeric(4,1),
  last_collection timestamptz,
  next_collection timestamptz,
  status text CHECK (status IN ('active', 'maintenance', 'cleaning', 'inactive')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS'yi etkinleştir
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tanks ENABLE ROW LEVEL SECURITY;

-- RLS politikaları
CREATE POLICY "Yetkilendirilmiş kullanıcılar milk_sessions tablosuna erişebilir"
  ON milk_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Yetkilendirilmiş kullanıcılar milk_records tablosuna erişebilir"
  ON milk_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Yetkilendirilmiş kullanıcılar milk_quality_tests tablosuna erişebilir"
  ON milk_quality_tests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Yetkilendirilmiş kullanıcılar milk_tanks tablosuna erişebilir"
  ON milk_tanks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- updated_at kolonlarını güncellemek için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tetikleyicileri oluştur
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_milk_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_sessions_updated_at
      BEFORE UPDATE ON milk_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_milk_records_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_records_updated_at
      BEFORE UPDATE ON milk_records
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_milk_quality_tests_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_quality_tests_updated_at
      BEFORE UPDATE ON milk_quality_tests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_milk_tanks_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_tanks_updated_at
      BEFORE UPDATE ON milk_tanks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;