/*
  # Süt Üretimi Tabloları

  1. Yeni Tablolar
    - `milk_sessions`: Sağım seansları
      - `id` (uuid, primary key)
      - `session_date` (date)
      - `session_type` (text): 'morning' veya 'evening'
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `total_milk` (numeric)
      - `milker_id` (uuid, foreign key)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_records`: Hayvan bazında süt kayıtları
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `animal_id` (uuid, foreign key)
      - `quantity` (numeric)
      - `fat_content` (numeric)
      - `protein_content` (numeric)
      - `temperature` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_quality_tests`: Süt kalite testleri
      - `id` (uuid, primary key)
      - `test_date` (date)
      - `fat_content` (numeric)
      - `protein_content` (numeric)
      - `lactose_content` (numeric)
      - `somatic_cell_count` (numeric)
      - `bacteria_count` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milk_tanks`: Süt tankları
      - `id` (uuid, primary key)
      - `name` (text)
      - `capacity` (numeric)
      - `current_volume` (numeric)
      - `temperature` (numeric)
      - `last_collection_date` (timestamptz)
      - `next_collection_date` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS aktif
    - Authenticated kullanıcılar için CRUD politikaları

  3. Tetikleyiciler
    - Otomatik timestamp güncellemesi
    - Süt miktarı güncelleme tetikleyicisi
*/

-- Süt Sağım Seansları Tablosu
CREATE TABLE IF NOT EXISTS milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  session_type text NOT NULL CHECK (session_type IN ('morning', 'evening')),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  total_milk numeric DEFAULT 0,
  milker_id uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  quantity numeric NOT NULL CHECK (quantity >= 0),
  fat_content numeric CHECK (fat_content >= 0),
  protein_content numeric CHECK (protein_content >= 0),
  temperature numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt Kalite Testleri Tablosu
CREATE TABLE IF NOT EXISTS milk_quality_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  fat_content numeric CHECK (fat_content >= 0),
  protein_content numeric CHECK (protein_content >= 0),
  lactose_content numeric CHECK (lactose_content >= 0),
  somatic_cell_count numeric CHECK (somatic_cell_count >= 0),
  bacteria_count numeric CHECK (bacteria_count >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt Tankları Tablosu
CREATE TABLE IF NOT EXISTS milk_tanks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity numeric NOT NULL CHECK (capacity > 0),
  current_volume numeric DEFAULT 0 CHECK (current_volume >= 0),
  temperature numeric,
  last_collection_date timestamptz,
  next_collection_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'cleaning')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (current_volume <= capacity)
);

-- RLS Politikaları
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tanks ENABLE ROW LEVEL SECURITY;

-- Authenticated kullanıcılar için politikalar
CREATE POLICY "Authenticated users can read milk sessions"
  ON milk_sessions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert milk sessions"
  ON milk_sessions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update milk sessions"
  ON milk_sessions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read milk records"
  ON milk_records FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert milk records"
  ON milk_records FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update milk records"
  ON milk_records FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read milk quality tests"
  ON milk_quality_tests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert milk quality tests"
  ON milk_quality_tests FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update milk quality tests"
  ON milk_quality_tests FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read milk tanks"
  ON milk_tanks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert milk tanks"
  ON milk_tanks FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update milk tanks"
  ON milk_tanks FOR UPDATE TO authenticated USING (true);

-- Otomatik timestamp güncellemesi için fonksiyonlar
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Timestamp tetikleyicileri
CREATE TRIGGER update_milk_sessions_updated_at
  BEFORE UPDATE ON milk_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milk_records_updated_at
  BEFORE UPDATE ON milk_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milk_quality_tests_updated_at
  BEFORE UPDATE ON milk_quality_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milk_tanks_updated_at
  BEFORE UPDATE ON milk_tanks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Süt miktarı güncelleme tetikleyicisi
CREATE OR REPLACE FUNCTION update_session_total_milk()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE milk_sessions
  SET total_milk = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM milk_records
    WHERE session_id = NEW.session_id
  )
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_session_total_milk_trigger
  AFTER INSERT OR UPDATE OR DELETE ON milk_records
  FOR EACH ROW
  EXECUTE FUNCTION update_session_total_milk();