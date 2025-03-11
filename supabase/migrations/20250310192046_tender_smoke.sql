/*
  # Süt Üretimi Şeması

  1. Yeni Tablolar
    - milk_sessions: Sağım seansları
    - milk_records: Hayvan bazında süt kayıtları
    - milk_quality_tests: Süt kalite testleri
    - milk_tanks: Süt tankı durumu

  2. Güvenlik
    - Her tablo için RLS etkinleştirildi
    - Yetkilendirilmiş kullanıcılar için CRUD politikaları tanımlandı

  3. İlişkiler
    - milk_records -> milk_sessions (session_id)
    - milk_records -> animals (animal_id)
    - milk_quality_tests -> milk_sessions (session_id)
    - milk_quality_tests -> milk_tanks (tank_id)
*/

-- Sağım Seansları Tablosu
CREATE TABLE IF NOT EXISTS milk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  session_type text NOT NULL CHECK (session_type IN ('morning', 'evening')),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  milker_id uuid REFERENCES auth.users(id),
  total_milk numeric(10,2),
  temperature numeric(4,1),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Süt Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS milk_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  quantity numeric(10,2) NOT NULL,
  fat_content numeric(4,2),
  protein_content numeric(4,2),
  temperature numeric(4,1),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Süt Kalite Testleri Tablosu
CREATE TABLE IF NOT EXISTS milk_quality_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES milk_sessions(id) ON DELETE CASCADE,
  tank_id uuid REFERENCES milk_tanks(id) ON DELETE CASCADE,
  test_date timestamptz NOT NULL DEFAULT now(),
  fat_content numeric(4,2),
  protein_content numeric(4,2),
  lactose_content numeric(4,2),
  somatic_cell_count integer,
  bacterial_count integer,
  antibiotics_test boolean,
  ph_level numeric(3,1),
  temperature numeric(4,1),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Süt Tankı Tablosu
CREATE TABLE IF NOT EXISTS milk_tanks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity numeric(10,2) NOT NULL,
  current_volume numeric(10,2) NOT NULL DEFAULT 0,
  temperature numeric(4,1),
  last_collection_date timestamptz,
  next_collection_date timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Etkinleştirme
ALTER TABLE milk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_tanks ENABLE ROW LEVEL SECURITY;

-- Güncelleme Tetikleyicileri
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_milk_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_sessions_updated_at
      BEFORE UPDATE ON milk_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_milk_records_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_records_updated_at
      BEFORE UPDATE ON milk_records
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_milk_quality_tests_updated_at'
  ) THEN
    CREATE TRIGGER update_milk_quality_tests_updated_at
      BEFORE UPDATE ON milk_quality_tests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
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

-- RLS Politikaları
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_sessions' AND policyname = 'milk_sessions_select_policy'
  ) THEN
    CREATE POLICY "milk_sessions_select_policy" 
    ON milk_sessions FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_sessions' AND policyname = 'milk_sessions_insert_policy'
  ) THEN
    CREATE POLICY "milk_sessions_insert_policy" 
    ON milk_sessions FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_sessions' AND policyname = 'milk_sessions_update_policy'
  ) THEN
    CREATE POLICY "milk_sessions_update_policy" 
    ON milk_sessions FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_sessions' AND policyname = 'milk_sessions_delete_policy'
  ) THEN
    CREATE POLICY "milk_sessions_delete_policy" 
    ON milk_sessions FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_records' AND policyname = 'milk_records_select_policy'
  ) THEN
    CREATE POLICY "milk_records_select_policy" 
    ON milk_records FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_records' AND policyname = 'milk_records_insert_policy'
  ) THEN
    CREATE POLICY "milk_records_insert_policy" 
    ON milk_records FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_records' AND policyname = 'milk_records_update_policy'
  ) THEN
    CREATE POLICY "milk_records_update_policy" 
    ON milk_records FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_records' AND policyname = 'milk_records_delete_policy'
  ) THEN
    CREATE POLICY "milk_records_delete_policy" 
    ON milk_records FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_quality_tests' AND policyname = 'milk_quality_tests_select_policy'
  ) THEN
    CREATE POLICY "milk_quality_tests_select_policy" 
    ON milk_quality_tests FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_quality_tests' AND policyname = 'milk_quality_tests_insert_policy'
  ) THEN
    CREATE POLICY "milk_quality_tests_insert_policy" 
    ON milk_quality_tests FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_quality_tests' AND policyname = 'milk_quality_tests_update_policy'
  ) THEN
    CREATE POLICY "milk_quality_tests_update_policy" 
    ON milk_quality_tests FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_quality_tests' AND policyname = 'milk_quality_tests_delete_policy'
  ) THEN
    CREATE POLICY "milk_quality_tests_delete_policy" 
    ON milk_quality_tests FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_tanks' AND policyname = 'milk_tanks_select_policy'
  ) THEN
    CREATE POLICY "milk_tanks_select_policy" 
    ON milk_tanks FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_tanks' AND policyname = 'milk_tanks_insert_policy'
  ) THEN
    CREATE POLICY "milk_tanks_insert_policy" 
    ON milk_tanks FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_tanks' AND policyname = 'milk_tanks_update_policy'
  ) THEN
    CREATE POLICY "milk_tanks_update_policy" 
    ON milk_tanks FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'milk_tanks' AND policyname = 'milk_tanks_delete_policy'
  ) THEN
    CREATE POLICY "milk_tanks_delete_policy" 
    ON milk_tanks FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;