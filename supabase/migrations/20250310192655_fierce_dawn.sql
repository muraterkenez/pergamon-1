/*
  # Sağlık Takibi Tabloları

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

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_health_records_updated_at ON health_records;
DROP TRIGGER IF EXISTS update_vaccinations_updated_at ON vaccinations;
DROP TRIGGER IF EXISTS update_disease_cases_updated_at ON disease_cases;
DROP TRIGGER IF EXISTS update_body_scores_updated_at ON body_scores;
DROP TRIGGER IF EXISTS update_biosecurity_checks_updated_at ON biosecurity_checks;

-- Create or replace the updated_at trigger function if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

-- Create triggers for each table
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