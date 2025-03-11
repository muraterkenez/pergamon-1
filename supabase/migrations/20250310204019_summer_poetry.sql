/*
  # Sağlık kayıtları için ilişki düzeltmeleri

  1. Değişiklikler
    - health_records tablosunda performed_by sütunu için foreign key oluşturulması
    - body_scores tablosunda scored_by sütunu için foreign key oluşturulması
    - biosecurity_checks tablosunda performed_by sütunu için foreign key oluşturulması

  2. Güvenlik
    - RLS politikaları güncellendi
*/

-- health_records tablosu için foreign key
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'health_records_performed_by_fkey'
  ) THEN
    ALTER TABLE health_records
    ADD CONSTRAINT health_records_performed_by_fkey
    FOREIGN KEY (performed_by) REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- body_scores tablosu için foreign key
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'body_scores_scored_by_fkey'
  ) THEN
    ALTER TABLE body_scores
    ADD CONSTRAINT body_scores_scored_by_fkey
    FOREIGN KEY (scored_by) REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- biosecurity_checks tablosu için foreign key
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'biosecurity_checks_performed_by_fkey'
  ) THEN
    ALTER TABLE biosecurity_checks
    ADD CONSTRAINT biosecurity_checks_performed_by_fkey
    FOREIGN KEY (performed_by) REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- RLS politikalarını güncelle
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;

-- Okuma politikaları
CREATE POLICY "Herkes sağlık kayıtlarını okuyabilir"
ON health_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes vücut kondisyon skorlarını okuyabilir"
ON body_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes biyogüvenlik kontrollerini okuyabilir"
ON biosecurity_checks FOR SELECT
TO authenticated
USING (true);

-- Yazma politikaları
CREATE POLICY "Veterinerler sağlık kaydı ekleyebilir"
ON health_records FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM users
  WHERE id = auth.uid()
  AND role = 'veterinarian'
));

CREATE POLICY "Veterinerler vücut kondisyon skoru ekleyebilir"
ON body_scores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = scored_by AND EXISTS (
  SELECT 1 FROM users
  WHERE id = auth.uid()
  AND role = 'veterinarian'
));

CREATE POLICY "Veterinerler biyogüvenlik kontrolü ekleyebilir"
ON biosecurity_checks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM users
  WHERE id = auth.uid()
  AND role = 'veterinarian'
));