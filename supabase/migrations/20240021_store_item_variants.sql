-- ============================================================
-- MOTOR DE TIENDAS — Fase 2: variantes, stock y SKU de productos.
-- Aditivo sobre store_items existente.
-- ============================================================

ALTER TABLE store_items ADD COLUMN sku TEXT;
ALTER TABLE store_items ADD COLUMN track_stock BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE store_items ADD COLUMN stock INTEGER;

CREATE TABLE store_item_variants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_item_id UUID NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sku           TEXT,
  price_override NUMERIC(10,2),
  stock         INTEGER,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_store_item_variants_item ON store_item_variants(store_item_id);

ALTER TABLE store_item_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_item_variants_read_public" ON store_item_variants FOR SELECT
  USING (is_active = TRUE AND EXISTS (
    SELECT 1 FROM store_items si JOIN companies c ON c.id = si.company_id
    WHERE si.id = store_item_id AND si.is_active = TRUE AND c.is_active = TRUE AND c.is_approved = TRUE
  ));
CREATE POLICY "store_item_variants_owner_all" ON store_item_variants FOR ALL
  USING (EXISTS (
    SELECT 1 FROM store_items si WHERE si.id = store_item_id AND has_store_access(si.company_id, auth.uid())
  ));
CREATE POLICY "store_item_variants_admin_all" ON store_item_variants FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── Actualiza store_items/coupons para reconocer empleados ───
-- (creadas antes del sistema de empleados de la Fase 1; ahora que
-- existe has_store_access(), las alineamos para que un empleado
-- pueda gestionar catálogo y cupones igual que el dueño).

DROP POLICY "store_items_owner_read_own" ON store_items;
DROP POLICY "store_items_owner_insert" ON store_items;
DROP POLICY "store_items_owner_update" ON store_items;
DROP POLICY "store_items_owner_delete" ON store_items;
DROP POLICY "store_items_admin_all" ON store_items;

CREATE POLICY "store_items_owner_read_own" ON store_items FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_items_owner_insert" ON store_items FOR INSERT WITH CHECK (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_items_owner_update" ON store_items FOR UPDATE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_items_owner_delete" ON store_items FOR DELETE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_items_admin_all" ON store_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

DROP POLICY "coupons_owner_read_own" ON coupons;
DROP POLICY "coupons_owner_insert" ON coupons;
DROP POLICY "coupons_owner_update" ON coupons;
DROP POLICY "coupons_owner_delete" ON coupons;
DROP POLICY "coupons_admin_all" ON coupons;

CREATE POLICY "coupons_owner_read_own" ON coupons FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "coupons_owner_insert" ON coupons FOR INSERT WITH CHECK (has_store_access(company_id, auth.uid()));
CREATE POLICY "coupons_owner_update" ON coupons FOR UPDATE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "coupons_owner_delete" ON coupons FOR DELETE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "coupons_admin_all" ON coupons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- Los empleados también deben poder ver los datos de la tienda a la
-- que pertenecen (solo lectura; alta/edición/baja de la empresa
-- sigue siendo exclusiva del dueño).
CREATE POLICY "companies_employee_read" ON companies FOR SELECT USING (has_store_access(id, auth.uid()));
