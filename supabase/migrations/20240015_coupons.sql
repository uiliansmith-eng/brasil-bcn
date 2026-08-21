-- ============================================================
-- TIENDAS — paso 3: cupones
-- ============================================================

CREATE TABLE coupons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  code             TEXT NOT NULL,
  discount_type    TEXT NOT NULL,
  discount_value   NUMERIC(10,2) NOT NULL,
  starts_at        TIMESTAMPTZ,
  ends_at          TIMESTAMPTZ,
  max_uses         INTEGER,
  used_count       INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT coupons_discount_type_check CHECK (discount_type IN ('percentage', 'fixed')),
  UNIQUE(company_id, code)
);

CREATE INDEX idx_coupons_company ON coupons(company_id);
CREATE INDEX idx_coupons_active  ON coupons(company_id, is_active);

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_read_public"
  ON coupons FOR SELECT
  USING (
    is_active = TRUE
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
    AND EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE
    )
  );

CREATE POLICY "coupons_owner_read_own"
  ON coupons FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "coupons_owner_insert"
  ON coupons FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "coupons_owner_update"
  ON coupons FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "coupons_owner_delete"
  ON coupons FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid())
  );

CREATE POLICY "coupons_admin_all"
  ON coupons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
