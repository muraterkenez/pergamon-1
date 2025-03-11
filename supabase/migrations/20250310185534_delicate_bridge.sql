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
    - Kimliği doğrulanmış kullanıcılar için okuma ve yazma izinleri
*/

-- Stok Kalemleri Tablosu
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sku text NOT NULL UNIQUE,
  barcode text,
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
  performed_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Güncelleme Tetikleyicisi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_items_updated_at
  BEFORE UPDATE ON stock_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_stock_movements_updated_at
  BEFORE UPDATE ON stock_movements
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- RLS Politikaları
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Stok Kalemleri için Politikalar
CREATE POLICY "Kimliği doğrulanmış kullanıcılar stok kalemlerini görüntüleyebilir"
  ON stock_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar stok kalemi ekleyebilir"
  ON stock_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar stok kalemlerini güncelleyebilir"
  ON stock_items FOR UPDATE
  TO authenticated
  USING (true);

-- Stok Hareketleri için Politikalar
CREATE POLICY "Kimliği doğrulanmış kullanıcılar stok hareketlerini görüntüleyebilir"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar stok hareketi ekleyebilir"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Stok Miktarı Güncelleme Tetikleyicisi
CREATE OR REPLACE FUNCTION update_stock_quantity()
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

CREATE TRIGGER update_stock_quantity_on_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE PROCEDURE update_stock_quantity();