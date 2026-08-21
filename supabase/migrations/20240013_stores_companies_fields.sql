-- ============================================================
-- TIENDAS — paso 1: nuevos campos en companies + categorías
-- ============================================================

ALTER TABLE companies ADD COLUMN instagram TEXT;
ALTER TABLE companies ADD COLUMN business_hours JSONB;
ALTER TABLE companies ADD COLUMN language TEXT NOT NULL DEFAULT 'pt';
ALTER TABLE companies ADD COLUMN extra_info TEXT;
ALTER TABLE companies ADD COLUMN is_store BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN store_plan TEXT NOT NULL DEFAULT 'free';

CREATE INDEX idx_companies_is_store ON companies(is_store) WHERE is_store = TRUE;

ALTER TYPE company_category ADD VALUE IF NOT EXISTS 'bar_cafeteria';
ALTER TYPE company_category ADD VALUE IF NOT EXISTS 'barberia';
ALTER TYPE company_category ADD VALUE IF NOT EXISTS 'servicios_profesionales';
