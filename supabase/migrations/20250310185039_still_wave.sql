/*
  # Stok Yönetimi Tabloları Güncelleme

  1. Değişiklikler
    - Tablo yapısı basitleştirildi
    - Kategori ve tedarikçi referansları kaldırıldı
    - Doğrudan kategori ve birim alanları eklendi
    - Stok hareketleri için yeni yapı

  2. Yeni Tablolar
    - `stock_items`: Temel stok bilgileri
    - `stock_movements`: Stok hareketleri

  3. Güvenlik
    - RLS politikaları güncellendi
    - Depo personeli için özel yetkiler
*/

-- Stok kalemleri tablosu
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sku text NOT NULL UNIQUE,
  barcode text UNIQUE,
  unit text NOT NULL,
  quantity numeric(10,2) DEFAULT 0,
  min_quantity numeric(10,2) DEFAULT 0,
  max_quantity numeric(10,2),
  location text,
  price numeric(10,2) DEFAULT 0,
  expiry_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stok hareketleri tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES stock_items(id),
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out')),
  quantity numeric(10,2) NOT NULL,
  reference_type text NOT NULL,
  reference_id text NOT NULL,
  performed_by uuid REFERENCES auth.users(id),
  notes text,
  movement_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS stock_items_category_idx ON stock_items(category);
CREATE INDEX IF NOT EXISTS stock_items_sku_idx ON stock_items(sku);
CREATE INDEX IF NOT EXISTS stock_movements_item_idx ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS stock_movements_date_idx ON stock_movements(movement_date);

-- RLS Etkinleştirme
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Politikaları
CREATE POLICY "Herkes stok kalemlerini görüntüleyebilir"
  ON stock_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Depo personeli stok kalemlerini yönetebilir"
  ON stock_items FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin'));

CREATE POLICY "Depo personeli stok hareketlerini yönetebilir"
  ON stock_movements FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin') OR
    performed_by = auth.uid()
  );

-- Stok güncelleme tetikleyicisi
CREATE OR REPLACE FUNCTION update_stock_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE stock_items
    SET quantity = quantity + NEW.quantity
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type = 'out' THEN
    UPDATE stock_items
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_quantity();

-- Stok seviyesi kontrol tetikleyicisi
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity <= NEW.min_quantity THEN
    -- Düşük stok uyarısı (bildirim sistemi entegrasyonu için hazır)
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_stock_quantity
  AFTER UPDATE OF quantity ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION check_stock_levels();