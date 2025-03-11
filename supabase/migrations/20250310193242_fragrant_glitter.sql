/*
  # Sağlık Kayıtları Politikalarını Güncelle

  1. Değişiklikler
    - Mevcut politikaları kaldır
    - Yeni politikaları ekle
    - Her tablo için CRUD politikaları tanımla

  2. Güvenlik
    - Yetkilendirilmiş kullanıcılar için tam erişim
    - Anonim kullanıcılar için erişim yok
*/

-- Mevcut politikaları kaldır
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON health_records;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON health_records;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON health_records;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON health_records;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON vaccinations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON vaccinations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON vaccinations;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON vaccinations;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON disease_cases;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON disease_cases;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON disease_cases;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON disease_cases;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON body_scores;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON body_scores;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON body_scores;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON body_scores;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON biosecurity_checks;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON biosecurity_checks;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON biosecurity_checks;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON biosecurity_checks;

-- Health Records politikaları
CREATE POLICY "Authenticated users can read health records"
ON health_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert health records"
ON health_records FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update health records"
ON health_records FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete health records"
ON health_records FOR DELETE
TO authenticated
USING (true);

-- Vaccinations politikaları
CREATE POLICY "Authenticated users can read vaccinations"
ON vaccinations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert vaccinations"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update vaccinations"
ON vaccinations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vaccinations"
ON vaccinations FOR DELETE
TO authenticated
USING (true);

-- Disease Cases politikaları
CREATE POLICY "Authenticated users can read disease cases"
ON disease_cases FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert disease cases"
ON disease_cases FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update disease cases"
ON disease_cases FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete disease cases"
ON disease_cases FOR DELETE
TO authenticated
USING (true);

-- Body Scores politikaları
CREATE POLICY "Authenticated users can read body scores"
ON body_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert body scores"
ON body_scores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update body scores"
ON body_scores FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete body scores"
ON body_scores FOR DELETE
TO authenticated
USING (true);

-- Biosecurity Checks politikaları
CREATE POLICY "Authenticated users can read biosecurity checks"
ON biosecurity_checks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert biosecurity checks"
ON biosecurity_checks FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update biosecurity checks"
ON biosecurity_checks FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete biosecurity checks"
ON biosecurity_checks FOR DELETE
TO authenticated
USING (true);