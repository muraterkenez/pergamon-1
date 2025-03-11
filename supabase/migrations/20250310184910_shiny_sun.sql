/*
  # Stok Yönetimi Tabloları

  1. Yeni Tablolar
    - `stock_items`
      - Temel stok bilgileri
      - Kategori ve birim bilgileri
      - Minimum ve maksimum stok seviyeleri
      - Fiyat ve konum bilgileri

    - `stock_movements`
      - Stok giriş/çıkış hareketleri
      - Hareket tipi ve miktarı
      - Referans ve açıklama bilgileri

    - `stock_categories`
      - Stok kategorileri
      - Kategori özellikleri
      - Özel alanlar

    - `suppliers`
      - Tedarikçi bilgileri
      - İletişim detayları
      - Ödeme şartları

    - `purchase_orders`
      - Satın alma siparişleri
      - Sipariş detayları
      - Teslimat bilgileri

  2. Güvenlik
    - RLS politikaları ile erişim kontrolü
    - Depo personeli için özel yetkiler

  3. Tetikleyiciler
    - Stok seviyesi kontrolleri
    - Hareket kayıtları
*/

-- Stok kategorileri tablosu
CREATE TABLE IF NOT EXISTS stock_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  custom_fields jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tedarikçiler tablosu
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  contact_person text,
  email text,
  phone text,
  address text,
  tax_id text,
  payment_terms text,
  status text NOT NULL DEFAULT 'active',
  rating integer CHECK (rating BETWEEN 1 AND 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stok kalemleri tablosu
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES stock_categories(id),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  barcode text UNIQUE,
  description text,
  unit text NOT NULL,
  quantity numeric(10,2) DEFAULT 0,
  min_quantity numeric(10,2) DEFAULT 0,
  max_quantity numeric(10,2),
  reorder_point numeric(10,2),
  location text,
  price numeric(10,2) DEFAULT 0,
  cost numeric(10,2) DEFAULT 0,
  supplier_id uuid REFERENCES suppliers(id),
  expiry_date date,
  status text NOT NULL DEFAULT 'active',
  custom_fields jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stok hareketleri tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES stock_items(id),
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2),
  total_price numeric(10,2),
  reference_type text NOT NULL,
  reference_id text NOT NULL,
  performed_by uuid REFERENCES auth.users(id),
  notes text,
  movement_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Satın alma siparişleri tablosu
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  order_number text NOT NULL UNIQUE,
  order_date date NOT NULL,
  expected_delivery_date date,
  status text NOT NULL DEFAULT 'draft',
  total_amount numeric(10,2) DEFAULT 0,
  shipping_address text,
  payment_terms text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sipariş kalemleri tablosu
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES purchase_orders(id),
  item_id uuid REFERENCES stock_items(id),
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  received_quantity numeric(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS stock_items_category_idx ON stock_items(category_id);
CREATE INDEX IF NOT EXISTS stock_items_supplier_idx ON stock_items(supplier_id);
CREATE INDEX IF NOT EXISTS stock_movements_item_idx ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS stock_movements_date_idx ON stock_movements(movement_date);
CREATE INDEX IF NOT EXISTS purchase_orders_supplier_idx ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS purchase_orders_status_idx ON purchase_orders(status);

-- RLS Etkinleştirme
ALTER TABLE stock_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Yönetici politikaları
CREATE POLICY "Yöneticiler tüm stok kategorilerini yönetebilir"
  ON stock_categories FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Yöneticiler tüm tedarikçileri yönetebilir"
  ON suppliers FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Yöneticiler tüm stok kalemlerini yönetebilir"
  ON stock_items FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Depo personeli politikaları
CREATE POLICY "Depo personeli stok hareketlerini yönetebilir"
  ON stock_movements FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin') OR
    performed_by = auth.uid()
  );

CREATE POLICY "Depo personeli stok seviyelerini güncelleyebilir"
  ON stock_items FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin'));

-- Satın alma personeli politikaları
CREATE POLICY "Satın alma personeli siparişleri yönetebilir"
  ON purchase_orders FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('purchasing_staff', 'admin') OR
    created_by = auth.uid()
  );

-- Güncelleme tetikleyicileri
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

-- Stok seviyesi kontrol fonksiyonu
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity <= NEW.min_quantity THEN
    -- Düşük stok uyarısı (bildirim sistemi entegrasyonu)
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_stock_quantity
  AFTER UPDATE OF quantity ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION check_stock_levels();