/*
  # Sağlık Takibi Tabloları

  1. Yeni Tablolar
    - `health_records`: Genel sağlık kayıtları
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `record_date` (timestamptz)
      - `record_type` (text): health, reproduction, transfer, measurement, welfare
      - `diagnosis` (text)
      - `treatment` (text)
      - `medication` (jsonb)
      - `performed_by` (uuid, foreign key)
      - `follow_up_date` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vaccinations`: Aşı kayıtları
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `vaccine_type` (text)
      - `application_date` (timestamptz)
      - `batch_number` (text)
      - `site` (text)
      - `next_due_date` (timestamptz)
      - `performed_by` (uuid, foreign key)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `disease_cases`: Hastalık vakaları
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `disease_type` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `severity` (text)
      - `symptoms` (text[])
      - `treatment_plan` (text)
      - `outcome` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `body_scores`: Vücut kondisyon skorları
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `score_date` (timestamptz)
      - `score` (numeric)
      - `weight` (numeric)
      - `height` (numeric)
      - `scored_by` (uuid, foreign key)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `biosecurity_checks`: Biyogüvenlik kontrolleri
      - `id` (uuid, primary key)
      - `check_date` (timestamptz)
      - `check_type` (text)
      - `status` (text)
      - `findings` (text)
      - `actions_taken` (text)
      - `performed_by` (uuid, foreign key)
      - `next_check_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS etkinleştirildi
    - Yetkilendirilmiş kullanıcılar için CRUD politikaları eklendi

  3. İndeksler
    - Performans için gerekli indeksler eklendi
*/

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  record_date timestamptz NOT NULL DEFAULT now(),
  record_type text NOT NULL CHECK (record_type IN ('health', 'reproduction', 'transfer', 'measurement', 'welfare')),
  diagnosis text,
  treatment text,
  medication jsonb,
  performed_by uuid REFERENCES auth.users(id),
  follow_up_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_records_record_date ON health_records(record_date);

-- Vaccinations Table
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_type text NOT NULL,
  application_date timestamptz NOT NULL DEFAULT now(),
  batch_number text,
  site text,
  next_due_date timestamptz,
  performed_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vaccinations_animal_id ON vaccinations(animal_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due_date ON vaccinations(next_due_date);

-- Disease Cases Table
CREATE TABLE IF NOT EXISTS disease_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  disease_type text NOT NULL,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  symptoms text[],
  treatment_plan text,
  outcome text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_disease_cases_animal_id ON disease_cases(animal_id);
CREATE INDEX IF NOT EXISTS idx_disease_cases_start_date ON disease_cases(start_date);

-- Body Scores Table
CREATE TABLE IF NOT EXISTS body_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  score_date timestamptz NOT NULL DEFAULT now(),
  score numeric NOT NULL CHECK (score >= 1 AND score <= 5),
  weight numeric,
  height numeric,
  scored_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_body_scores_animal_id ON body_scores(animal_id);
CREATE INDEX IF NOT EXISTS idx_body_scores_score_date ON body_scores(score_date);

-- Biosecurity Checks Table
CREATE TABLE IF NOT EXISTS biosecurity_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_date timestamptz NOT NULL DEFAULT now(),
  check_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('completed', 'pending', 'attention')),
  findings text,
  actions_taken text,
  performed_by uuid REFERENCES auth.users(id),
  next_check_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biosecurity_checks_check_date ON biosecurity_checks(check_date);
CREATE INDEX IF NOT EXISTS idx_biosecurity_checks_next_check_date ON biosecurity_checks(next_check_date);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "health_records_select_policy"
  ON health_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "health_records_insert_policy"
  ON health_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "health_records_update_policy"
  ON health_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "vaccinations_select_policy"
  ON vaccinations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "vaccinations_insert_policy"
  ON vaccinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "vaccinations_update_policy"
  ON vaccinations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "disease_cases_select_policy"
  ON disease_cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "disease_cases_insert_policy"
  ON disease_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "disease_cases_update_policy"
  ON disease_cases
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "body_scores_select_policy"
  ON body_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "body_scores_insert_policy"
  ON body_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "body_scores_update_policy"
  ON body_scores
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "biosecurity_checks_select_policy"
  ON biosecurity_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "biosecurity_checks_insert_policy"
  ON biosecurity_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "biosecurity_checks_update_policy"
  ON biosecurity_checks
  FOR UPDATE
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccinations_updated_at
  BEFORE UPDATE ON vaccinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disease_cases_updated_at
  BEFORE UPDATE ON disease_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_body_scores_updated_at
  BEFORE UPDATE ON body_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biosecurity_checks_updated_at
  BEFORE UPDATE ON biosecurity_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();