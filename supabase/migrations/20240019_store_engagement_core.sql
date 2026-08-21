-- ============================================================
-- MOTOR DE TIENDAS — Fase 5-9 (datos): reseñas, favoritos,
-- notificaciones, promociones, suscripciones, analítica, auditoría.
-- Aditivo.
-- ============================================================

-- ─── RESEÑAS ─────────────────────────────────────────────────

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL,
  comment     TEXT,
  reply       TEXT,
  is_hidden   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5),
  UNIQUE(company_id, user_id)
);

CREATE INDEX idx_reviews_company ON reviews(company_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_read_public" ON reviews FOR SELECT
  USING (is_hidden = FALSE AND EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE));
CREATE POLICY "reviews_user_read_own" ON reviews FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reviews_user_insert" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_user_update_own" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reviews_user_delete_own" ON reviews FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "reviews_store_reply" ON reviews FOR UPDATE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "reviews_admin_all" ON reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── FAVORITOS ───────────────────────────────────────────────

CREATE TABLE favorites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  store_item_id UUID REFERENCES store_items(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_target_check CHECK (company_id IS NOT NULL OR store_item_id IS NOT NULL),
  UNIQUE(user_id, company_id, store_item_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_owner_all" ON favorites FOR ALL USING (user_id = auth.uid());
CREATE POLICY "favorites_admin_all" ON favorites FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── NOTIFICACIONES (registro; el envío real por email/push/WhatsApp es aparte) ───

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_user_read_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_user_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── PROMOCIONES / DESTACADOS ───────────────────────────────────

CREATE TABLE promotions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope         TEXT NOT NULL,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  store_item_id UUID REFERENCES store_items(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  image_url     TEXT,
  link_url      TEXT,
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT promotions_scope_check CHECK (scope IN ('store', 'product', 'category', 'home_banner'))
);

CREATE INDEX idx_promotions_company ON promotions(company_id);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promotions_read_public" ON promotions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "promotions_owner_all" ON promotions FOR ALL USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "promotions_admin_all" ON promotions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── SUSCRIPCIONES / PLANES ─────────────────────────────────────
-- Brasil BCN cobra únicamente la suscripción de la tienda; no hay
-- comisión sobre ventas en ningún punto de este esquema.

CREATE TABLE subscription_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key             TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'EUR',
  billing_period  TEXT NOT NULL DEFAULT 'monthly',
  features        JSONB,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT subscription_plans_period_check CHECK (billing_period IN ('monthly', 'yearly'))
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscription_plans_read_all" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "subscription_plans_admin_all" ON subscription_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

INSERT INTO subscription_plans (key, name, price, billing_period, features) VALUES
  ('free', 'Free', 0, 'monthly', '{"items_limit": 10, "coupons": false, "bookings": false}'),
  ('business', 'Business', 9.99, 'monthly', '{"items_limit": 100, "coupons": true, "bookings": true}'),
  ('premium', 'Premium', 19.99, 'monthly', '{"items_limit": null, "coupons": true, "bookings": true, "qr": true, "promotions": true}');

CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  plan_id                 UUID NOT NULL REFERENCES subscription_plans(id),
  status                  TEXT NOT NULL DEFAULT 'trialing',
  current_period_end      TIMESTAMPTZ,
  stripe_subscription_id  TEXT,
  stripe_customer_id      TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'past_due', 'canceled', 'trialing'))
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_owner_read" ON subscriptions FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "subscriptions_admin_all" ON subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── ANALÍTICA (mismo patrón que quiz_events) ───────────────────

CREATE TABLE store_analytics_events (
  id          BIGSERIAL PRIMARY KEY,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  session_id  TEXT,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_store_analytics_company ON store_analytics_events(company_id, created_at);

ALTER TABLE store_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_analytics_public_insert" ON store_analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "store_analytics_owner_read" ON store_analytics_events FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_analytics_admin_read" ON store_analytics_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── AUDITORÍA ───────────────────────────────────────────────

CREATE TABLE audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_self_insert" ON audit_logs FOR INSERT WITH CHECK (actor_id = auth.uid());
CREATE POLICY "audit_logs_admin_read" ON audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));
