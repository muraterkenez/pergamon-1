/*
  # Kullanıcı Yönetimi Tabloları

  1. Yeni Tablolar
    - `users`
      - `id` (uuid, primary key) - Supabase Auth ile eşleşen kullanıcı ID
      - `email` (text, unique) - Kullanıcı e-posta adresi
      - `full_name` (text) - Kullanıcının tam adı
      - `phone` (text) - Telefon numarası
      - `role` (text) - Kullanıcı rolü (yönetici, veteriner, çalışan vb.)
      - `status` (text) - Hesap durumu (aktif, pasif)
      - `last_login` (timestamptz) - Son giriş tarihi
      - `created_at` (timestamptz) - Kayıt tarihi
      - `updated_at` (timestamptz) - Son güncelleme tarihi

  2. Güvenlik
    - RLS politikaları ile kullanıcı erişimi kısıtlanmıştır
    - Yöneticiler tüm kullanıcıları görebilir ve yönetebilir
    - Kullanıcılar sadece kendi bilgilerini görebilir
*/

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'employee',
  status text NOT NULL DEFAULT 'active',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS etkinleştirme
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Yöneticiler için politika
CREATE POLICY "Yöneticiler tüm kullanıcıları yönetebilir"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Kullanıcılar için okuma politikası
CREATE POLICY "Kullanıcılar kendi bilgilerini görebilir"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Kullanıcılar için güncelleme politikası
CREATE POLICY "Kullanıcılar kendi bilgilerini güncelleyebilir"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tetikleyici fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Güncelleme tetikleyicisi
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Yeni kullanıcı oluşturulduğunda otomatik profil oluşturma
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (NEW.id, NEW.email, 
    CASE 
      WHEN NEW.email LIKE '%admin%' THEN 'admin'
      ELSE 'employee'
    END,
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Yeni kullanıcı tetikleyicisi
CREATE TRIGGER create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();