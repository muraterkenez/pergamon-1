/*
  # Süt Üretimi Tabloları

  1. Yeni Tablolar
    - `milk_sessions`
      - Sağım seansı bilgileri (sabah/akşam)
      - Sağımcı, başlangıç/bitiş zamanı
      - Toplam süt miktarı ve sıcaklık
    
    - `milk_records`
      - Hayvan bazında süt üretim kayıtları
      - Miktar ve kalite parametreleri
      - Sağım seansı ile ilişki

    - `milk_quality_tests`
      - Süt kalite test sonuçları
      - Yağ, protein, somatik hücre vb.
      - Parti numarası ve test tarihi

    - `milk_tanks`
      - Süt tankı bilgileri
      - Kapasite ve doluluk
      - Sıcaklık takibi

  2. Güvenlik
    - RLS politikaları ile erişim kontrolü
    - Yönetici ve sağımcılar için özel yetkiler

  3. Tetikleyiciler
    - Tank doluluk kontrolü
    - Kalite parametrelerinde anormallik tespiti
*/

-- Sağım seansları tablosu
CREATE TABLE IF NOT EXISTS milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('morning', 'evening')),
  milker_id uuid REFERENCES auth.users(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  total_milk numeric(8,2) NOT NULL DEFAULT 0,
  temperature numeric(4,1),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Aynı günde aynı tipte birden fazla seans olmamalı
  UNIQUE(session_date, session_type)
);

-- Süt üretim kayıtları tablosu
CREATE TABLE IF NOT EXISTS milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  quantity numeric(6,2) NOT NULL,
  temperature numeric(4,1),
  conductivity numeric(6,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Bir seansta bir hayvan için tek kayıt olmalı
  UNIQUE(session_id, animal_id)
);

-- Süt kalite testleri tablosu
CREATE TABLE IF NOT EXISTS milk_quality_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_date date NOT NULL,
  batch_number text NOT NULL,
  fat_content numeric(4,2),
  protein_content numeric(4,2),
  lactose_content numeric(4,2),
  somatic_cell_count integer,
  bacterial_count integer,
  freezing_point numeric(5,3),
  ph_value numeric(3,1),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Süt tankları tablosu
CREATE TABLE IF NOT EXISTS milk_tanks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity numeric(8,2) NOT NULL,
  current_volume numeric(8,2) NOT NULL DEFAULT 0,
  temperature numeric(4,1),
  last_cleaned_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cleaning', 'maintenance')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Tank doluluk kontrolü
  CONSTRAINT valid_volume CHECK (current_volume >= 0 AND current_volume <= capacity)
);

-- Tank sıcaklık log tablosu
CREATE TABLE IF NOT EXISTS milk_tank_temperature_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id uuid REFERENCES milk_tanks(id) ON DELETE CASCADE,
  temperature numeric(4,1) NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS milk_sessions_date_idx ON milk_sessions(session_date);
CREATE INDEX IF NOT EXISTS milk_records_session_idx ON milk_records(session_id);
CREATE INDEX IF NOT EXISTS milk_records_animal_idx ON milk_records(animal_id);
CREATE INDEX IF NOT EXISTS milk_quality_tests_date_idx ON milk_quality_tests(test_date);
CREATE INDEX IF NOT EXISTS milk_tank_temp_logs_tank_idx ON milk_tank_temperature_logs(tank_id);

-- RLS Etkinleştirme
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tank_temperature_logs ENABLE ROW LEVEL SECURITY;

-- Yönetici politikaları
CREATE POLICY "Yöneticiler tüm sağım seanslarını yönetebilir"
  ON milk_sessions FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Yöneticiler tüm süt kayıtlarını yönetebilir"
  ON milk_records FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sağımcı politikaları
CREATE POLICY "Sağımcılar kendi seanslarını yönetebilir"
  ON milk_sessions FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'milker' AND
    milker_id = auth.uid()
  );

CREATE POLICY "Sağımcılar kendi seanslarındaki kayıtları yönetebilir"
  ON milk_records FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'milker' AND
    session_id IN (
      SELECT id FROM milk_sessions WHERE milker_id = auth.uid()
    )
  );

-- Kalite kontrol politikaları
CREATE POLICY "Kalite kontrol ekibi test sonuçlarını yönetebilir"
  ON milk_quality_tests FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'quality_control'));

-- Tank yönetimi politikaları
CREATE POLICY "Tank durumunu herkes görüntüleyebilir"
  ON milk_tanks FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Tank durumunu yöneticiler güncelleyebilir"
  ON milk_tanks FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Güncelleme tetikleyicileri
CREATE TRIGGER update_milk_sessions_updated_at
  BEFORE UPDATE ON milk_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_milk_records_updated_at
  BEFORE UPDATE ON milk_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_milk_tanks_updated_at
  BEFORE UPDATE ON milk_tanks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Tank sıcaklık kontrolü tetikleyicisi
CREATE OR REPLACE FUNCTION check_tank_temperature()
RETURNS TRIGGER AS $$
BEGIN
  -- Sıcaklık 2-6°C aralığında olmalı
  IF NEW.temperature < 2 OR NEW.temperature > 6 THEN
    INSERT INTO milk_tank_temperature_logs (tank_id, temperature)
    VALUES (NEW.id, NEW.temperature);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_tank_temperature_trigger
  AFTER UPDATE OF temperature ON milk_tanks
  FOR EACH ROW
  EXECUTE FUNCTION check_tank_temperature();