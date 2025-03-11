/*
  # Stok Yönetimi Tabloları

  1. Yeni Tablolar
    - `stock_items`: Stok kalemleri
      - `id` (uuid, primary key)
      - `name` (text): Ürün adı
      - `category` (text): Kategori (feed, raw_material, veterinary, dairy_product, equipment)
      - `sku` (text): Stok kodu
      - `barcode` (text, nullable): Barkod
      - `unit` (text): Birim (kg, liter, piece, box, package)
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
      - `type` (text): Hareket tipi (in, out)
      - `quantity` (numeric): Miktar
      - `reference` (text): Referans no
      - `price` (numeric): Birim fiyat
      - `description` (text, nullable): Açıklama
      - `performed_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - RLS politikaları her tablo için etkinleştirildi
    - Kimlik doğrulaması yapılmış kullanıcılar için CRUD işlemleri
    - Yönetici rolü için tam erişim

  3. Tetikleyiciler
    - Otomatik tarih güncellemesi
    - Stok hareketi sonrası miktar güncelleme
*/

-- stock_items tablosu
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT valid_category CHECK (category IN ('feed', 'raw_material', 'veterinary', 'dairy_product', 'equipment')),
  CONSTRAINT valid_unit CHECK (unit IN ('kg', 'liter', 'piece', 'box', 'package')),
  CONSTRAINT positive_quantity CHECK (quantity >= 0),
  CONSTRAINT valid_min_quantity CHECK (min_quantity >= 0),
  CONSTRAINT valid_max_quantity CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  CONSTRAINT positive_price CHECK (price >= 0)
);

-- stock_movements tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  type text NOT NULL,
  quantity numeric NOT NULL,
  reference text NOT NULL,
  price numeric NOT NULL,
  description text,
  performed_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT valid_movement_type CHECK (type IN ('in', 'out')),
  CONSTRAINT positive_movement_quantity CHECK (quantity > 0),
  CONSTRAINT positive_movement_price CHECK (price >= 0)
);

-- Otomatik tarih güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mevcut tetikleyicileri kaldır
DROP TRIGGER IF EXISTS update_stock_items_updated_at ON stock_items;
DROP TRIGGER IF EXISTS update_stock_movements_updated_at ON stock_movements;
DROP TRIGGER IF EXISTS update_stock_quantity_after_movement ON stock_movements;

-- stock_items için tetikleyici
CREATE TRIGGER update_stock_items_updated_at
  BEFORE UPDATE ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- stock_movements için tetikleyici
CREATE TRIGGER update_stock_movements_updated_at
  BEFORE UPDATE ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Stok hareketi sonrası miktar güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_stock_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'in' THEN
    UPDATE stock_items
    SET quantity = quantity + NEW.quantity
    WHERE id = NEW.item_id;
  ELSIF NEW.type = 'out' THEN
    UPDATE stock_items
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Stok hareketi tetikleyicisi
CREATE TRIGGER update_stock_quantity_after_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_quantity();

-- RLS politikaları
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- stock_items için politikalar
CREATE POLICY "Authenticated users can view stock items"
  ON stock_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stock items"
  ON stock_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stock items"
  ON stock_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stock items"
  ON stock_items
  FOR DELETE
  TO authenticated
  USING (true);

-- stock_movements için politikalar
CREATE POLICY "Authenticated users can view stock movements"
  ON stock_movements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stock movements"
  ON stock_movements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stock movements"
  ON stock_movements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stock movements"
  ON stock_movements
  FOR DELETE
  TO authenticated
  USING (true);