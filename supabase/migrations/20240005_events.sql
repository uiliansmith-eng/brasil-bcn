-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL,
  category        event_category NOT NULL DEFAULT 'otro',
  image_url       TEXT,
  location        TEXT,
  address         TEXT,
  city            TEXT NOT NULL DEFAULT 'Barcelona',
  date_start      TIMESTAMPTZ NOT NULL,
  date_end        TIMESTAMPTZ,
  price           INTEGER DEFAULT 0,
  price_visible   BOOLEAN NOT NULL DEFAULT TRUE,
  capacity        INTEGER,
  attendees       INTEGER NOT NULL DEFAULT 0,
  whatsapp        TEXT,
  url             TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved     BOOLEAN NOT NULL DEFAULT FALSE,
  is_free         BOOLEAN NOT NULL DEFAULT TRUE,
  views           INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_organizer  ON events(organizer_id);
CREATE INDEX idx_events_category   ON events(category);
CREATE INDEX idx_events_city       ON events(city);
CREATE INDEX idx_events_date       ON events(date_start);
CREATE INDEX idx_events_active     ON events(is_active, is_approved, date_start);
CREATE INDEX idx_events_slug       ON events(slug);

-- Trigger
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM events WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_slug
  BEFORE INSERT ON events
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_event_slug();

-- is_free computed from price
CREATE OR REPLACE FUNCTION compute_event_is_free()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_free := (NEW.price IS NULL OR NEW.price = 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_is_free
  BEFORE INSERT OR UPDATE OF price ON events
  FOR EACH ROW EXECUTE FUNCTION compute_event_is_free();

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_read_active"
  ON events FOR SELECT
  USING (
    is_active = TRUE
    AND is_approved = TRUE
    AND date_start > NOW() - INTERVAL '1 day'
  );

CREATE POLICY "events_organizer_read_own"
  ON events FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "events_organizer_insert"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "events_organizer_update"
  ON events FOR UPDATE
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "events_organizer_delete"
  ON events FOR DELETE
  USING (auth.uid() = organizer_id);

CREATE POLICY "events_admin_all"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
