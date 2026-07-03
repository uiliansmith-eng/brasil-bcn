-- ============================================================
-- JOBS — city priority (Barcelona first in default listing)
-- ============================================================

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS city_priority SMALLINT GENERATED ALWAYS AS (
    CASE WHEN city = 'Barcelona' THEN 0 ELSE 1 END
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_jobs_city_priority ON jobs(city_priority);
