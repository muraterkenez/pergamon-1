/*
  # Sağlık kayıtları için ilişki düzeltmeleri

  1. Değişiklikler
    - vaccinations tablosunda performed_by sütunu için foreign key oluşturulması

  2. Güvenlik
    - RLS politikaları güncellendi
*/

-- vaccinations tablosu için foreign key
ALTER TABLE vaccinations
ADD CONSTRAINT vaccinations_performed_by_fkey
FOREIGN KEY (performed_by) REFERENCES auth.users(id)
ON DELETE SET NULL;

-- RLS politikalarını güncelle
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Herkes aşı kayıtlarını okuyabilir"
ON vaccinations FOR SELECT
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

CREATE POLICY "Veterinerler aşı kaydı ekleyebilir"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM users
  WHERE id = auth.uid()
  AND role = 'veterinarian'
));