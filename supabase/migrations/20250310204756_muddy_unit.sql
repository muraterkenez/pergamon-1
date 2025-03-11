/*
  # Sağlık kayıtları için ilişki düzeltmeleri

  1. Güvenlik
    - RLS politikaları güncellendi
*/

-- RLS'yi etkinleştir
ALTER TABLE biosecurity_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Okuma politikaları
CREATE POLICY "Herkes biyogüvenlik kontrollerini okuyabilir"
ON biosecurity_checks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Herkes aşı kayıtlarını okuyabilir"
ON vaccinations FOR SELECT
TO authenticated
USING (true);

-- Yazma politikaları
CREATE POLICY "Veterinerler biyogüvenlik kontrolü ekleyebilir"
ON biosecurity_checks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid()
  AND raw_user_meta_data->>'role' = 'veterinarian'
));

CREATE POLICY "Veterinerler aşı kaydı ekleyebilir"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid()
  AND raw_user_meta_data->>'role' = 'veterinarian'
));