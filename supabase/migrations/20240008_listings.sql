-- Enums
CREATE TYPE listing_category AS ENUM (
  'electronica', 'muebles', 'ropa', 'vehiculos', 'libros',
  'deportes', 'hogar', 'bebes', 'otro'
);

CREATE TYPE listing_condition AS ENUM (
  'nuevo', 'como_nuevo', 'buen_estado', 'aceptable'
);

-- Table
CREATE TABLE IF NOT EXISTS listings (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id        uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title            text NOT NULL,
  description      text NOT NULL,
  price            numeric(10,2),
  price_negotiable boolean NOT NULL DEFAULT false,
  category         listing_category NOT NULL,
  condition        listing_condition NOT NULL,
  images           text[] NOT NULL DEFAULT '{}',
  city             text NOT NULL DEFAULT 'Barcelona',
  whatsapp         text,
  is_active        boolean NOT NULL DEFAULT true,
  is_approved      boolean NOT NULL DEFAULT false,
  is_sold          boolean NOT NULL DEFAULT false,
  views            integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX listings_category_idx       ON listings(category);
CREATE INDEX listings_active_approved_idx ON listings(is_active, is_approved, is_sold);
CREATE INDEX listings_seller_id_idx      ON listings(seller_id);
CREATE INDEX listings_created_at_idx     ON listings(created_at DESC);

-- Updated_at trigger
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View increment function
CREATE OR REPLACE FUNCTION increment_listing_views(p_id uuid)
RETURNS void AS $$
  UPDATE listings SET views = views + 1 WHERE id = p_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listings_public_read" ON listings
  FOR SELECT USING (is_active = true AND is_approved = true AND is_sold = false);

CREATE POLICY "listings_owner_insert" ON listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "listings_owner_update" ON listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "listings_owner_delete" ON listings
  FOR DELETE USING (auth.uid() = seller_id);

CREATE POLICY "listings_admin_all" ON listings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
