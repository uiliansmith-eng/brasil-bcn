-- ============================================================
-- TIENDAS — paso 2: productos / servicios
-- ============================================================

CREATE TABLE store_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  item_type     TEXT NOT NULL DEFAULT 'product',
  name          TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  price         NUMERIC(10,2),
  category      TEXT,
  duration_min  INTEGER,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT store_items_item_type_check CHECK (item_type IN ('product', 'service'))
);

CREATE INDEX idx_store_items_company ON store_items(company_id);
CREATE INDEX idx_store_items_active  ON store_items(company_id, is_active);

CREATE TRIGGER store_items_updated_at
  BEFORE UPDATE ON store_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_items_read_public"
  ON store_items FOR SELECT
  USING (
    is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE
    )
  );

CREATE POLICY "store_items_owner_read_own"
  ON store_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "store_items_owner_insert"
  ON store_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "store_items_owner_update"
  ON store_items FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "store_items_owner_delete"
  ON store_items FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "store_items_admin_all"
  ON store_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
