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
DROP POLICY IF EXISTS "Authenticated users can view health records" ON health_records;
DROP POLICY IF EXISTS "Authenticated users can insert health records" ON health_records;
DROP POLICY IF EXISTS "Authenticated users can update health records" ON health_records;

DROP POLICY IF EXISTS "Authenticated users can view vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Authenticated users can insert vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Authenticated users can update vaccinations" ON vaccinations;

DROP POLICY IF EXISTS "Authenticated users can view disease cases" ON disease_cases;
DROP POLICY IF EXISTS "Authenticated users can insert disease cases" ON disease_cases;
DROP POLICY IF EXISTS "Authenticated users can update disease cases" ON disease_cases;

DROP POLICY IF EXISTS "Authenticated users can view body scores" ON body_scores;
DROP POLICY IF EXISTS "Authenticated users can insert body scores" ON body_scores;
DROP POLICY IF EXISTS "Authenticated users can update body scores" ON body_scores;

DROP POLICY IF EXISTS "Authenticated users can view biosecurity checks" ON biosecurity_checks;
DROP POLICY IF EXISTS "Authenticated users can insert biosecurity checks" ON biosecurity_checks;
DROP POLICY IF EXISTS "Authenticated users can update biosecurity checks" ON biosecurity_checks;

-- Yeni politikaları ekle
-- Health Records politikaları
CREATE POLICY "Enable read access for authenticated users"
ON health_records FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON health_records FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON health_records FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON health_records FOR DELETE
TO authenticated
USING (true);

-- Vaccinations politikaları
CREATE POLICY "Enable read access for authenticated users"
ON vaccinations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON vaccinations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON vaccinations FOR DELETE
TO authenticated
USING (true);

-- Disease Cases politikaları
CREATE POLICY "Enable read access for authenticated users"
ON disease_cases FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON disease_cases FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON disease_cases FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON disease_cases FOR DELETE
TO authenticated
USING (true);

-- Body Scores politikaları
CREATE POLICY "Enable read access for authenticated users"
ON body_scores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON body_scores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON body_scores FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON body_scores FOR DELETE
TO authenticated
USING (true);

-- Biosecurity Checks politikaları
CREATE POLICY "Enable read access for authenticated users"
ON biosecurity_checks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON biosecurity_checks FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON biosecurity_checks FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON biosecurity_checks FOR DELETE
TO authenticated
USING (true);