-- ============================================================
-- COMPANIES
-- ============================================================

CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  category      company_category NOT NULL,
  logo_url      TEXT,
  cover_url     TEXT,
  website       TEXT,
  phone         TEXT,
  whatsapp      TEXT,
  email         TEXT,
  address       TEXT,
  city          TEXT NOT NULL DEFAULT 'Barcelona',
  latitude      DECIMAL(9, 6),
  longitude     DECIMAL(9, 6),
  gallery       TEXT[] DEFAULT '{}',
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved   BOOLEAN NOT NULL DEFAULT FALSE,
  views         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_owner    ON companies(owner_id);
CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_city     ON companies(city);
CREATE INDEX idx_companies_active   ON companies(is_active, is_approved);
CREATE INDEX idx_companies_slug     ON companies(slug);

-- Trigger
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_company_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM companies WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_slug
  BEFORE INSERT ON companies
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_company_slug();

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_read_active"
  ON companies FOR SELECT
  USING (is_active = TRUE AND is_approved = TRUE);

CREATE POLICY "companies_owner_read_own"
  ON companies FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "companies_owner_insert"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "companies_owner_update"
  ON companies FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "companies_owner_delete"
  ON companies FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "companies_admin_all"
  ON companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
