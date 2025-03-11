/*
  # Sağlık Takibi Tabloları

  1. Yeni Tablolar
    - `health_records`
      - Genel sağlık kayıtları
      - Muayene, tedavi ve aşılama bilgileri
      - Teşhis ve tedavi detayları
      - Veteriner hekim bilgisi

    - `vaccinations`
      - Aşı takip kayıtları
      - Aşı türü ve uygulama bilgileri
      - Sonraki aşı tarihi

    - `disease_cases`
      - Hastalık vakaları
      - Başlangıç ve bitiş tarihleri
      - Tedavi süreci ve sonuç

    - `body_scores`
      - Vücut kondisyon skorları
      - Periyodik ölçümler
      - Değişim takibi

    - `biosecurity_checks`
      - Biyogüvenlik kontrolleri
      - Kontrol tarihi ve sonuçları
      - Sorumlu personel

  2. Güvenlik
    - RLS politikaları ile erişim kontrolü
    - Veteriner ve sağlık personeli için özel yetkiler

  3. Tetikleyiciler
    - Aşı hatırlatmaları
    - Sağlık durumu değişikliği bildirimleri
*/

-- Sağlık kayıtları tablosu
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  record_date date NOT NULL,
  record_type text NOT NULL CHECK (record_type IN (
    'examination',
    'treatment',
    'vaccination',
    'surgery',
    'routine_check'
  )),
  diagnosis text,
  treatment text,
  medication jsonb,
  performed_by uuid REFERENCES auth.users(id),
  follow_up_date date,
  cost numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Aşı takip tablosu
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_type text NOT NULL,
  application_date date NOT NULL,
  batch_number text,
  dose numeric(5,2),
  application_site text,
  next_due_date date,
  performed_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hastalık vakaları tablosu
CREATE TABLE IF NOT EXISTS disease_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  symptoms text[],
  treatment_plan text,
  outcome text,
  quarantine boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vücut kondisyon skorları tablosu
CREATE TABLE IF NOT EXISTS body_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  score_date date NOT NULL,
  body_condition_score numeric(3,1) CHECK (body_condition_score BETWEEN 1 AND 5),
  weight numeric(6,2),
  height numeric(5,1),
  notes text,
  scored_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Biyogüvenlik kontrolleri tablosu
CREATE TABLE IF NOT EXISTS biosecurity_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_date date NOT NULL,
  check_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'warning')),
  findings text[],
  corrective_actions text,
  performed_by uuid REFERENCES auth.users(id),
  next_check_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS health_records_animal_idx ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS health_records_date_idx ON health_records(record_date);
CREATE INDEX IF NOT EXISTS vaccinations_animal_idx ON vaccinations(animal_id);
CREATE INDEX IF NOT EXISTS vaccinations_date_idx ON vaccinations(application_date);
CREATE INDEX IF NOT EXISTS disease_cases_animal_idx ON disease_cases(animal_id);
CREATE INDEX IF NOT EXISTS body_scores_animal_idx ON body_scores(animal_id);
CREATE INDEX IF NOT EXISTS biosecurity_checks_date_idx ON biosecurity_checks(check_date);

-- RLS Etkinleştirme
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;

-- Yönetici politikaları
CREATE POLICY "Yöneticiler tüm sağlık kayıtlarını yönetebilir"
  ON health_records FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Yöneticiler tüm aşı kayıtlarını yönetebilir"
  ON vaccinations FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Veteriner politikaları
CREATE POLICY "Veterinerler sağlık kayıtlarını yönetebilir"
  ON health_records FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'veterinarian' OR
    performed_by = auth.uid()
  );

CREATE POLICY "Veterinerler aşı kayıtlarını yönetebilir"
  ON vaccinations FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'veterinarian' OR
    performed_by = auth.uid()
  );

-- Sağlık personeli politikaları
CREATE POLICY "Sağlık personeli kayıtları görüntüleyebilir"
  ON health_records FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('health_staff', 'veterinarian', 'admin'));

CREATE POLICY "Sağlık personeli vücut skorlarını yönetebilir"
  ON body_scores FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' IN ('health_staff', 'veterinarian', 'admin'));

-- Güncelleme tetikleyicileri
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vaccinations_updated_at
  BEFORE UPDATE ON vaccinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_disease_cases_updated_at
  BEFORE UPDATE ON disease_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_body_scores_updated_at
  BEFORE UPDATE ON body_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Aşı hatırlatma fonksiyonu
CREATE OR REPLACE FUNCTION check_upcoming_vaccinations()
RETURNS TRIGGER AS $$
BEGIN
  -- Yaklaşan aşıları kontrol et (7 gün kala)
  IF NEW.next_due_date IS NOT NULL AND 
     NEW.next_due_date - CURRENT_DATE BETWEEN 0 AND 7 THEN
    -- Bildirim tablosuna ekle (bildirim sistemi ayrıca oluşturulacak)
    -- TODO: Bildirim sistemi entegrasyonu
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_vaccination_dates
  AFTER INSERT OR UPDATE OF next_due_date ON vaccinations
  FOR EACH ROW
  EXECUTE FUNCTION check_upcoming_vaccinations();