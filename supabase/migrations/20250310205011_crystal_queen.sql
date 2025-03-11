/*
  # Sağlık kayıtları için ilişki düzeltmeleri

  1. Değişiklikler
    - health_records tablosunda performed_by ilişkisi düzeltildi
    - Diğer sağlık kayıtları tablolarında ilişkiler güncellendi

  2. Güvenlik
    - RLS politikaları güncellendi
*/

-- health_records tablosu için ilişki düzeltmesi
ALTER TABLE health_records DROP CONSTRAINT IF EXISTS health_records_performed_by_fkey;
ALTER TABLE health_records ADD CONSTRAINT health_records_performed_by_fkey 
  FOREIGN KEY (performed_by) REFERENCES auth.users(id);

-- vaccinations tablosu için ilişki düzeltmesi
ALTER TABLE vaccinations DROP CONSTRAINT IF EXISTS vaccinations_performed_by_fkey;
ALTER TABLE vaccinations ADD CONSTRAINT vaccinations_performed_by_fkey 
  FOREIGN KEY (performed_by) REFERENCES auth.users(id);

-- body_scores tablosu için ilişki düzeltmesi
ALTER TABLE body_scores DROP CONSTRAINT IF EXISTS body_scores_scored_by_fkey;
ALTER TABLE body_scores ADD CONSTRAINT body_scores_scored_by_fkey 
  FOREIGN KEY (scored_by) REFERENCES auth.users(id);

-- biosecurity_checks tablosu için ilişki düzeltmesi
ALTER TABLE biosecurity_checks DROP CONSTRAINT IF EXISTS biosecurity_checks_performed_by_fkey;
ALTER TABLE biosecurity_checks ADD CONSTRAINT biosecurity_checks_performed_by_fkey 
  FOREIGN KEY (performed_by) REFERENCES auth.users(id);

-- RLS'yi etkinleştir
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Okuma politikaları
CREATE POLICY "Herkes aşı kayıtlarını okuyabilir"
ON vaccinations FOR SELECT
TO authenticated
USING (true);

-- Yazma politikaları
CREATE POLICY "Veterinerler aşı kaydı ekleyebilir"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by AND EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid()
  AND raw_user_meta_data->>'role' = 'veterinarian'
));