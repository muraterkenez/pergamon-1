/*
  # Ek Stok Yönetimi Tabloları

  1. Yeni Tablolar
    - `suppliers`: Tedarikçiler
      - `id` (uuid, primary key)
      - `name` (text): Tedarikçi adı
      - `contact_person` (text): İletişim kişisi
      - `email` (text): E-posta
      - `phone` (text): Telefon
      - `address` (text): Adres
      - `tax_id` (text): Vergi no
      - `payment_terms` (text, nullable): Ödeme koşulları
      - `notes` (text, nullable): Notlar
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `purchase_orders`: Satın alma siparişleri
      - `id` (uuid, primary key)
      - `supplier_id` (uuid, references suppliers)
      - `order_date` (timestamptz)
      - `expected_delivery` (timestamptz, nullable)
      - `status` (text): Sipariş durumu
      - `total_amount` (numeric)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `order_items`: Sipariş kalemleri
      - `id` (uuid, primary key)
      - `order_id` (uuid, references purchase_orders)
      - `item_id` (uuid, references stock_items)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `received_quantity` (numeric, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - RLS politikaları her tablo için etkinleştirildi
    - Kimliği doğrulanmış kullanıcılar için okuma ve yazma izinleri
*/

-- Tedarikçiler Tablosu
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text NOT NULL,
  email text,
  phone text,
  address text,
  tax_id text UNIQUE,
  payment_terms text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Satın Alma Siparişleri Tablosu
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  order_date timestamptz NOT NULL DEFAULT now(),
  expected_delivery timestamptz,
  status text NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled')),
  total_amount numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sipariş Kalemleri Tablosu
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES stock_items(id) ON DELETE RESTRICT,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  received_quantity numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Güncelleme Tetikleyicileri
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- RLS Politikaları
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Tedarikçiler için Politikalar
CREATE POLICY "Kimliği doğrulanmış kullanıcılar tedarikçileri görüntüleyebilir"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar tedarikçi ekleyebilir"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar tedarikçileri güncelleyebilir"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (true);

-- Satın Alma Siparişleri için Politikalar
CREATE POLICY "Kimliği doğrulanmış kullanıcılar siparişleri görüntüleyebilir"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar sipariş ekleyebilir"
  ON purchase_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar siparişleri güncelleyebilir"
  ON purchase_orders FOR UPDATE
  TO authenticated
  USING (true);

-- Sipariş Kalemleri için Politikalar
CREATE POLICY "Kimliği doğrulanmış kullanıcılar sipariş kalemlerini görüntüleyebilir"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar sipariş kalemi ekleyebilir"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Kimliği doğrulanmış kullanıcılar sipariş kalemlerini güncelleyebilir"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true);

-- Sipariş Toplam Tutarı Güncelleme Tetikleyicisi
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE purchase_orders
  SET total_amount = (
    SELECT SUM(total_price)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_order_total_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_order_total();