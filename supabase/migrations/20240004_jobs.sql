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
