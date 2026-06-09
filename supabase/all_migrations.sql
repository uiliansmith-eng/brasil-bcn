-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'company', 'admin');

CREATE TYPE job_type AS ENUM (
  'full_time',
  'part_time',
  'freelance',
  'internship',
  'temporary'
);

CREATE TYPE job_category AS ENUM (
  'hosteleria',
  'construccion',
  'limpieza',
  'belleza',
  'transporte',
  'comercio',
  'tecnologia',
  'educacion',
  'salud',
  'administracion',
  'otro'
);

CREATE TYPE company_category AS ENUM (
  'restaurantes',
  'abogados',
  'peluquerias',
  'construccion',
  'contables',
  'tiendas',
  'transporte',
  'educacion',
  'salud',
  'tecnologia',
  'otro'
);

CREATE TYPE event_category AS ENUM (
  'fiesta',
  'cultura',
  'deporte',
  'networking',
  'gastronomia',
  'arte',
  'musica',
  'otro'
);

CREATE TYPE guide_category AS ENUM (
  'nie',
  'empadronamiento',
  'autonomos',
  'seguridad_social',
  'bancos',
  'vivienda',
  'educacion',
  'sanidad',
  'otro'
);

CREATE TYPE ad_position AS ENUM (
  'home_hero',
  'sidebar',
  'footer',
  'jobs_top',
  'companies_top'
);
-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'user',
  phone       TEXT,
  whatsapp    TEXT,
  bio         TEXT,
  city        TEXT DEFAULT 'Barcelona',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
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
-- ============================================================
-- JOBS
-- ============================================================

CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id      UUID REFERENCES companies(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        job_category NOT NULL,
  job_type        job_type NOT NULL DEFAULT 'full_time',
  salary_min      INTEGER,
  salary_max      INTEGER,
  salary_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  location        TEXT,
  city            TEXT NOT NULL DEFAULT 'Barcelona',
  whatsapp        TEXT,
  email           TEXT,
  requirements    TEXT,
  benefits        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved     BOOLEAN NOT NULL DEFAULT FALSE,
  is_urgent       BOOLEAN NOT NULL DEFAULT FALSE,
  views           INTEGER NOT NULL DEFAULT 0,
  applications    INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_posted_by   ON jobs(posted_by);
CREATE INDEX idx_jobs_company     ON jobs(company_id);
CREATE INDEX idx_jobs_category    ON jobs(category);
CREATE INDEX idx_jobs_city        ON jobs(city);
CREATE INDEX idx_jobs_active      ON jobs(is_active, is_approved, expires_at);
CREATE INDEX idx_jobs_created     ON jobs(created_at DESC);

-- Trigger
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_read_active"
  ON jobs FOR SELECT
  USING (
    is_active = TRUE
    AND is_approved = TRUE
    AND expires_at > NOW()
  );

CREATE POLICY "jobs_owner_read_own"
  ON jobs FOR SELECT
  USING (auth.uid() = posted_by);

CREATE POLICY "jobs_owner_insert"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "jobs_owner_update"
  ON jobs FOR UPDATE
  USING (auth.uid() = posted_by)
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "jobs_owner_delete"
  ON jobs FOR DELETE
  USING (auth.uid() = posted_by);

CREATE POLICY "jobs_admin_all"
  ON jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
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
-- ============================================================
-- ADVERTISEMENTS
-- ============================================================

CREATE TABLE advertisements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT NOT NULL,
  url             TEXT NOT NULL,
  position        ad_position NOT NULL,
  starts_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at         TIMESTAMPTZ NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  clicks          INTEGER NOT NULL DEFAULT 0,
  impressions     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ads_position  ON advertisements(position);
CREATE INDEX idx_ads_active    ON advertisements(is_active, starts_at, ends_at);
CREATE INDEX idx_ads_advertiser ON advertisements(advertiser_id);

-- Trigger
CREATE TRIGGER advertisements_updated_at
  BEFORE UPDATE ON advertisements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ads_read_active"
  ON advertisements FOR SELECT
  USING (
    is_active = TRUE
    AND starts_at <= NOW()
    AND ends_at >= NOW()
  );

CREATE POLICY "ads_admin_all"
  ON advertisements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Function to increment ad clicks (callable via RPC)
CREATE OR REPLACE FUNCTION increment_ad_click(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE advertisements SET clicks = clicks + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment ad impressions
CREATE OR REPLACE FUNCTION increment_ad_impression(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE advertisements SET impressions = impressions + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
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
