/*
  # Hayvan Yönetimi Tabloları

  1. Yeni Tablolar
    - `animals`
      - Temel bilgiler (id, ulusal_id, isim, doğum tarihi vb.)
      - Fiziksel özellikler (ağırlık, boy, vücut kondisyon skoru)
      - Üreme bilgileri (durum, son tohumlama, beklenen doğum)
      - Soy bilgileri (anne, baba referansları)
      - Durum ve grup bilgileri
      - Sistem bilgileri (oluşturma, güncelleme tarihleri)

  2. Güvenlik
    - RLS politikaları ile erişim kontrolü
    - Yönetici ve veterinerler tam erişime sahip
    - Diğer çalışanlar sadece okuma yetkisine sahip

  3. Tetikleyiciler
    - Güncelleme tarihi otomatik güncelleme
    - Hayvan durumu değişikliklerinde log tutma
*/

-- Hayvanlar tablosu
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id text UNIQUE NOT NULL,
  name text,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('female', 'male')),
  breed text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deceased')),
  group_type text NOT NULL CHECK (group_type IN ('lactating', 'dry', 'young', 'treatment')),
  
  -- Fiziksel özellikler
  weight numeric(6,2),
  height numeric(5,2),
  body_condition_score numeric(3,1),
  lactation_number integer DEFAULT 0,
  welfare_score integer,
  
  -- Soy bilgileri
  mother_id uuid REFERENCES animals(id),
  father_id uuid REFERENCES animals(id),
  
  -- Üreme bilgileri
  reproductive_status text CHECK (reproductive_status IN ('open', 'inseminated', 'pregnant', 'calving')),
  last_insemination_date date,
  expected_calving_date date,
  
  -- Diğer bilgiler
  rfid_tag text,
  image_url text,
  notes text,
  
  -- Sistem bilgileri
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Kısıtlamalar
  CONSTRAINT valid_calving_date CHECK (
    expected_calving_date IS NULL OR 
    expected_calving_date > last_insemination_date
  ),
  CONSTRAINT valid_parent CHECK (
    id != mother_id AND id != father_id
  )
);

-- İndeksler
CREATE INDEX IF NOT EXISTS animals_national_id_idx ON animals(national_id);
CREATE INDEX IF NOT EXISTS animals_status_idx ON animals(status);
CREATE INDEX IF NOT EXISTS animals_group_type_idx ON animals(group_type);

-- RLS etkinleştirme
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Yönetici ve veterinerler için tam erişim politikası
CREATE POLICY "Yönetici ve veterinerler tam erişime sahip"
  ON animals
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'veterinarian')
  );

-- Diğer çalışanlar için okuma politikası
CREATE POLICY "Çalışanlar hayvanları görüntüleyebilir"
  ON animals
  FOR SELECT
  TO authenticated
  USING (true);

-- Güncelleme tetikleyicisi
CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Hayvan durum değişikliği log tablosu
CREATE TABLE IF NOT EXISTS animal_status_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  old_status text,
  new_status text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  notes text
);

-- Durum değişikliği log tetikleyicisi
CREATE OR REPLACE FUNCTION log_animal_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO animal_status_logs (
      animal_id,
      old_status,
      new_status,
      changed_by,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_animal_status_changes
  AFTER UPDATE OF status ON animals
  FOR EACH ROW
  EXECUTE FUNCTION log_animal_status_change();