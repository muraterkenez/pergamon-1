/*
  # Stok Yönetimi Tabloları

  1. Yeni Tablolar
    - `stock_items`: Stok kalemleri
      - `id` (uuid, primary key)
      - `name` (text): Ürün adı
      - `category` (text): Kategori
      - `sku` (text): Stok kodu
      - `barcode` (text, nullable): Barkod
      - `unit` (text): Birim
      - `quantity` (numeric): Miktar
      - `min_quantity` (numeric): Minimum stok seviyesi
      - `max_quantity` (numeric, nullable): Maksimum stok seviyesi
      - `location` (text, nullable): Depo konumu
      - `price` (numeric): Birim fiyat
      - `expiry_date` (timestamptz, nullable): Son kullanma tarihi
      - `description` (text, nullable): Açıklama
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `stock_movements`: Stok hareketleri
      - `id` (uuid, primary key)
      - `item_id` (uuid, references stock_items)
      - `type` (text): Hareket tipi (in/out)
      - `quantity` (numeric): Miktar
      - `reference` (text): Referans no
      - `price` (numeric): Birim fiyat
      - `description` (text, nullable): Açıklama
      - `performed_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - RLS politikaları her tablo için etkinleştirildi
    - Kimliği doğrulanmış kullanıcılar için CRUD izinleri
*/

-- Stok Kalemleri Tablosu
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sku text UNIQUE NOT NULL,
  barcode text UNIQUE,
  unit text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  min_quantity numeric NOT NULL DEFAULT 0,
  max_quantity numeric,
  location text,
  price numeric NOT NULL DEFAULT 0,
  expiry_date timestamptz,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stok Hareketleri Tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('in', 'out')),
  quantity numeric NOT NULL,
  reference text NOT NULL,
  price numeric NOT NULL,
  description text,
  performed_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Güncelleme Tetikleyicileri
DO $$ 
BEGIN
  -- updated_at tetikleyici fonksiyonunu oluştur
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;

  -- stock_items için updated_at tetikleyicisini oluştur
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stock_items_updated_at') THEN
    CREATE TRIGGER update_stock_items_updated_at
      BEFORE UPDATE ON stock_items
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;

  -- stock_movements için updated_at tetikleyicisini oluştur
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stock_movements_updated_at') THEN
    CREATE TRIGGER update_stock_movements_updated_at
      BEFORE UPDATE ON stock_movements
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;

  -- Stok miktarı güncelleme tetikleyici fonksiyonunu oluştur
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_stock_quantity') THEN
    CREATE FUNCTION update_stock_quantity()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'in' THEN
          UPDATE stock_items
          SET quantity = quantity + NEW.quantity
          WHERE id = NEW.item_id;
        ELSE
          UPDATE stock_items
          SET quantity = quantity - NEW.quantity
          WHERE id = NEW.item_id;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;

  -- stock_movements için miktar güncelleme tetikleyicisini oluştur
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stock_quantity_on_movement') THEN
    CREATE TRIGGER update_stock_quantity_on_movement
      AFTER INSERT ON stock_movements
      FOR EACH ROW
      EXECUTE PROCEDURE update_stock_quantity();
  END IF;
END $$;

-- RLS Politikaları
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Stok Kalemleri için Politikalar
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_items' AND policyname = 'authenticated_select'
  ) THEN
    CREATE POLICY "authenticated_select"
      ON stock_items FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_items' AND policyname = 'authenticated_insert'
  ) THEN
    CREATE POLICY "authenticated_insert"
      ON stock_items FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_items' AND policyname = 'authenticated_update'
  ) THEN
    CREATE POLICY "authenticated_update"
      ON stock_items FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Stok Hareketleri için Politikalar
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_movements' AND policyname = 'authenticated_select'
  ) THEN
    CREATE POLICY "authenticated_select"
      ON stock_movements FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_movements' AND policyname = 'authenticated_insert'
  ) THEN
    CREATE POLICY "authenticated_insert"
      ON stock_movements FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_movements' AND policyname = 'authenticated_update'
  ) THEN
    CREATE POLICY "authenticated_update"
      ON stock_movements FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;