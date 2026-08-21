-- ============================================================
-- MOTOR DE TIENDAS — Fase 1: categorías, módulos, empleados,
-- estado de tienda. Aditivo, no toca companies existentes.
-- ============================================================

-- Nota: 'super_admin' y 'employee' se añadieron al enum user_role
-- en una migración separada (20240016a_store_engine_roles.sql),
-- porque Postgres no permite usar un valor de enum recién creado
-- dentro de la misma transacción en la que se añadió.

-- ─── CATEGORÍAS Y SUBCATEGORÍAS (12 categorías del negocio) ───

CREATE TABLE store_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT NOT NULL UNIQUE,
  label         TEXT NOT NULL,
  icon          TEXT,
  legacy_company_category TEXT NOT NULL, -- mapeo al enum company_category existente, para que /empresas siga filtrando bien
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE store_subcategories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES store_categories(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  label         TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(category_id, key)
);

CREATE INDEX idx_store_subcategories_category ON store_subcategories(category_id);

-- Lectura pública libre (son catálogos, no datos sensibles)
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "store_categories_read_all" ON store_categories FOR SELECT USING (true);
CREATE POLICY "store_subcategories_read_all" ON store_subcategories FOR SELECT USING (true);
CREATE POLICY "store_categories_admin_all" ON store_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));
CREATE POLICY "store_subcategories_admin_all" ON store_subcategories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── companies: nuevas columnas de categoría estructurada y estado ───

ALTER TABLE companies ADD COLUMN store_category_id UUID REFERENCES store_categories(id) ON DELETE SET NULL;
ALTER TABLE companies ADD COLUMN store_subcategory_id UUID REFERENCES store_subcategories(id) ON DELETE SET NULL;
ALTER TABLE companies ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE companies ADD CONSTRAINT companies_status_check
  CHECK (status IN ('draft', 'published', 'paused', 'suspended'));

-- Mantiene status sincronizado con is_active/is_approved existentes,
-- sin que nada que ya lea esas dos columnas deje de funcionar.
CREATE OR REPLACE FUNCTION sync_company_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'suspended' THEN
    NEW.is_active := FALSE;
  ELSIF NOT NEW.is_active THEN
    NEW.status := 'suspended';
  ELSIF NEW.is_approved THEN
    IF NEW.status = 'draft' THEN NEW.status := 'published'; END IF;
  ELSE
    NEW.status := 'draft';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_sync_status
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION sync_company_status();

-- ─── MÓDULOS POR TIENDA (feature flags reales, no solo config en código) ───

CREATE TABLE store_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, module_key),
  CONSTRAINT store_modules_key_check CHECK (module_key IN (
    'products', 'services', 'bookings', 'payments', 'coupons', 'qr',
    'gallery', 'reviews', 'promotions', 'delivery', 'pickup'
  ))
);

CREATE INDEX idx_store_modules_company ON store_modules(company_id);

ALTER TABLE store_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_modules_read_public" ON store_modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE));
CREATE POLICY "store_modules_owner_read_own" ON store_modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "store_modules_owner_insert" ON store_modules FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "store_modules_owner_update" ON store_modules FOR UPDATE
  USING (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "store_modules_admin_all" ON store_modules FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── EMPLEADOS / MULTIUSUARIO POR TIENDA ───

CREATE TABLE store_employees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'employee',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, user_id),
  CONSTRAINT store_employees_role_check CHECK (role IN ('employee', 'manager'))
);

CREATE INDEX idx_store_employees_company ON store_employees(company_id);
CREATE INDEX idx_store_employees_user ON store_employees(user_id);

ALTER TABLE store_employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_employees_owner_all" ON store_employees FOR ALL
  USING (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.owner_id = auth.uid()));
CREATE POLICY "store_employees_self_read" ON store_employees FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "store_employees_admin_all" ON store_employees FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- Helper: ¿es este usuario dueño o empleado con acceso a esta tienda?
CREATE OR REPLACE FUNCTION has_store_access(store_id UUID, uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM companies c WHERE c.id = store_id AND c.owner_id = uid
    UNION
    SELECT 1 FROM store_employees e WHERE e.company_id = store_id AND e.user_id = uid
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
