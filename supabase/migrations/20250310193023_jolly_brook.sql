/*
  # Sağlık Kayıtları Tabloları

  1. Yeni Tablolar
    - `health_records`: Genel sağlık kayıtları
    - `vaccinations`: Aşı kayıtları
    - `disease_cases`: Hastalık vakaları
    - `body_scores`: Vücut kondisyon skorları
    - `biosecurity_checks`: Biyogüvenlik kontrolleri

  2. Güvenlik
    - Tüm tablolar için RLS etkinleştirildi
    - Yetkilendirilmiş kullanıcılar için CRUD politikaları eklendi

  3. İndeksler
    - Performans için gerekli indeksler eklendi
*/

-- Genel sağlık kayıtları tablosu
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  record_date timestamptz NOT NULL DEFAULT now(),
  record_type text NOT NULL CHECK (record_type IN ('health', 'reproduction', 'transfer', 'measurement', 'welfare')),
  diagnosis text,
  treatment text,
  medication jsonb,
  performed_by uuid NOT NULL REFERENCES users(id),
  follow_up_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Aşı kayıtları tablosu
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  vaccine_type text NOT NULL,
  batch_number text,
  application_date timestamptz NOT NULL DEFAULT now(),
  application_site text,
  next_due_date timestamptz,
  performed_by uuid NOT NULL REFERENCES users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Hastalık vakaları tablosu
CREATE TABLE IF NOT EXISTS disease_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  symptoms text,
  diagnosis text,
  treatment text,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'chronic')),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Vücut kondisyon skorları tablosu
CREATE TABLE IF NOT EXISTS body_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  score numeric(3,1) NOT NULL CHECK (score >= 1 AND score <= 5),
  score_date timestamptz NOT NULL DEFAULT now(),
  scored_by uuid NOT NULL REFERENCES users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Biyogüvenlik kontrolleri tablosu
CREATE TABLE IF NOT EXISTS biosecurity_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_date timestamptz NOT NULL DEFAULT now(),
  check_type text NOT NULL CHECK (check_type IN ('vehicle', 'personnel', 'facility', 'equipment', 'animal')),
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'needs_attention')),
  findings text,
  actions_taken text,
  performed_by uuid NOT NULL REFERENCES users(id),
  next_check_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Güvenlik politikaları
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;

-- Sağlık kayıtları için politikalar
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

CREATE POLICY "Authenticated users can update health records"
  ON health_records
  FOR UPDATE
  TO authenticated
  USING (true);

-- Aşı kayıtları için politikalar
CREATE POLICY "Authenticated users can view vaccinations"
  ON vaccinations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vaccinations"
  ON vaccinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vaccinations"
  ON vaccinations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Hastalık vakaları için politikalar
CREATE POLICY "Authenticated users can view disease cases"
  ON disease_cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert disease cases"
  ON disease_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update disease cases"
  ON disease_cases
  FOR UPDATE
  TO authenticated
  USING (true);

-- Vücut kondisyon skorları için politikalar
CREATE POLICY "Authenticated users can view body scores"
  ON body_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert body scores"
  ON body_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update body scores"
  ON body_scores
  FOR UPDATE
  TO authenticated
  USING (true);

-- Biyogüvenlik kontrolleri için politikalar
CREATE POLICY "Authenticated users can view biosecurity checks"
  ON biosecurity_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert biosecurity checks"
  ON biosecurity_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update biosecurity checks"
  ON biosecurity_checks
  FOR UPDATE
  TO authenticated
  USING (true);

-- İndeksler
CREATE INDEX IF NOT EXISTS health_records_animal_id_idx ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS health_records_record_date_idx ON health_records(record_date);
CREATE INDEX IF NOT EXISTS vaccinations_animal_id_idx ON vaccinations(animal_id);
CREATE INDEX IF NOT EXISTS vaccinations_application_date_idx ON vaccinations(application_date);
CREATE INDEX IF NOT EXISTS disease_cases_animal_id_idx ON disease_cases(animal_id);
CREATE INDEX IF NOT EXISTS disease_cases_start_date_idx ON disease_cases(start_date);
CREATE INDEX IF NOT EXISTS body_scores_animal_id_idx ON body_scores(animal_id);
CREATE INDEX IF NOT EXISTS body_scores_score_date_idx ON body_scores(score_date);
CREATE INDEX IF NOT EXISTS biosecurity_checks_check_date_idx ON biosecurity_checks(check_date);

-- Updated_at trigger'ları için anonim blok
DO $$ 
BEGIN
  -- Health records tablosu için trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_health_records_updated_at'
  ) THEN
    CREATE TRIGGER update_health_records_updated_at
      BEFORE UPDATE ON health_records
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Vaccinations tablosu için trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_vaccinations_updated_at'
  ) THEN
    CREATE TRIGGER update_vaccinations_updated_at
      BEFORE UPDATE ON vaccinations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Disease cases tablosu için trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_disease_cases_updated_at'
  ) THEN
    CREATE TRIGGER update_disease_cases_updated_at
      BEFORE UPDATE ON disease_cases
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Body scores tablosu için trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_body_scores_updated_at'
  ) THEN
    CREATE TRIGGER update_body_scores_updated_at
      BEFORE UPDATE ON body_scores
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Biosecurity checks tablosu için trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_biosecurity_checks_updated_at'
  ) THEN
    CREATE TRIGGER update_biosecurity_checks_updated_at
      BEFORE UPDATE ON biosecurity_checks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;