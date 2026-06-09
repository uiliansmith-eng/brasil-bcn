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
