-- ============================================================
-- GUIDES
-- ============================================================

CREATE TABLE guides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  category        guide_category NOT NULL,
  cover_url       TEXT,
  reading_time    INTEGER DEFAULT 5,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  views           INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_guides_author     ON guides(author_id);
CREATE INDEX idx_guides_category   ON guides(category);
CREATE INDEX idx_guides_published  ON guides(is_published, published_at DESC);
CREATE INDEX idx_guides_slug       ON guides(slug);

-- Trigger
CREATE TRIGGER guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Set published_at when published
CREATE OR REPLACE FUNCTION set_guide_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND OLD.is_published = FALSE THEN
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guides_published_at
  BEFORE UPDATE OF is_published ON guides
  FOR EACH ROW EXECUTE FUNCTION set_guide_published_at();

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_guide_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM guides WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guides_slug
  BEFORE INSERT ON guides
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_guide_slug();

-- RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guides_read_published"
  ON guides FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "guides_author_read_own"
  ON guides FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "guides_admin_all"
  ON guides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
