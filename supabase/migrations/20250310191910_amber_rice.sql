/*
  # Süt Üretimi Politikaları - Düzeltme

  1. Değişiklikler
    - Mevcut politikaları kaldır
    - Yeni politikaları ekle
    - Her tablo için CRUD politikaları tanımla

  2. Güvenlik
    - Yetkilendirilmiş kullanıcılar için CRUD işlemlerine izin ver
    - Her tabloda RLS'yi etkinleştir
*/

-- Mevcut politikaları kaldır
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar milk_sessions tablosuna erişe" ON milk_sessions;
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar milk_records tablosuna erişe" ON milk_records;
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar milk_quality_tests tablosuna erişe" ON milk_quality_tests;
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar milk_tanks tablosuna erişe" ON milk_tanks;

-- Yeni politikaları ekle
CREATE POLICY "milk_sessions_select_policy" 
ON milk_sessions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "milk_sessions_insert_policy" 
ON milk_sessions FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "milk_sessions_update_policy" 
ON milk_sessions FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "milk_sessions_delete_policy" 
ON milk_sessions FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "milk_records_select_policy" 
ON milk_records FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "milk_records_insert_policy" 
ON milk_records FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "milk_records_update_policy" 
ON milk_records FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "milk_records_delete_policy" 
ON milk_records FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "milk_quality_tests_select_policy" 
ON milk_quality_tests FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "milk_quality_tests_insert_policy" 
ON milk_quality_tests FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "milk_quality_tests_update_policy" 
ON milk_quality_tests FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "milk_quality_tests_delete_policy" 
ON milk_quality_tests FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "milk_tanks_select_policy" 
ON milk_tanks FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "milk_tanks_insert_policy" 
ON milk_tanks FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "milk_tanks_update_policy" 
ON milk_tanks FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "milk_tanks_delete_policy" 
ON milk_tanks FOR DELETE 
TO authenticated 
USING (true);