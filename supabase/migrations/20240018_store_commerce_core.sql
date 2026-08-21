-- ============================================================
-- MOTOR DE TIENDAS — Fase 3-4 (datos): pedidos, pagos, reservas,
-- horarios estructurados, cupones QR. Aditivo.
--
-- Nota: los pagos reales (Stripe) requieren que el propietario de
-- Brasil BCN conecte una cuenta Stripe. Estas tablas dejan lista
-- toda la arquitectura de datos para cuando eso ocurra; mientras
-- tanto el módulo "payments" queda con is_active=false por defecto
-- (ver STORE_MODULE_DEFAULTS).
-- ============================================================

-- ─── PEDIDOS ─────────────────────────────────────────────────

CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'pending',
  payment_status    TEXT NOT NULL DEFAULT 'unpaid',
  fulfillment_method TEXT NOT NULL DEFAULT 'pickup',
  subtotal          NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount          NUMERIC(10,2) NOT NULL DEFAULT 0,
  total             NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_id         UUID REFERENCES coupons(id) ON DELETE SET NULL,
  customer_name     TEXT,
  customer_phone    TEXT,
  customer_notes    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled', 'refunded')),
  CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  CONSTRAINT orders_fulfillment_check CHECK (fulfillment_method IN ('pickup', 'delivery'))
);

CREATE INDEX idx_orders_company ON orders(company_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_customer_read_own" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "orders_customer_insert" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders_store_read" ON orders FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "orders_store_update" ON orders FOR UPDATE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "orders_admin_all" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_item_id   UUID REFERENCES store_items(id) ON DELETE SET NULL,
  name_snapshot   TEXT NOT NULL,
  price_snapshot  NUMERIC(10,2) NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  subtotal        NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_via_order" ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id
    AND (o.customer_id = auth.uid() OR has_store_access(o.company_id, auth.uid()))
  ));
CREATE POLICY "order_items_customer_insert" ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.customer_id = auth.uid()));
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── PAGOS (arquitectura lista; sin proveedor conectado aún) ───

CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_id            UUID REFERENCES orders(id) ON DELETE SET NULL,
  reservation_id      UUID, -- FK añadida tras crear reservations más abajo
  provider            TEXT NOT NULL DEFAULT 'stripe',
  provider_payment_id TEXT,
  amount              NUMERIC(10,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'EUR',
  status              TEXT NOT NULL DEFAULT 'pending',
  idempotency_key     TEXT UNIQUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT payments_status_check CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_company ON payments(company_id);
CREATE INDEX idx_payments_order ON payments(order_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_store_read" ON payments FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "payments_admin_all" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── RESERVAS ────────────────────────────────────────────────

CREATE TABLE reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  store_item_id UUID REFERENCES store_items(id) ON DELETE SET NULL,
  customer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT,
  date          DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME,
  status        TEXT NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reservations_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'))
);

CREATE INDEX idx_reservations_company ON reservations(company_id);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_date ON reservations(company_id, date);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reservations_customer_read_own" ON reservations FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "reservations_customer_insert" ON reservations FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "reservations_customer_cancel" ON reservations FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "reservations_store_read" ON reservations FOR SELECT USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "reservations_store_update" ON reservations FOR UPDATE USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "reservations_admin_all" ON reservations FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

ALTER TABLE payments ADD CONSTRAINT payments_reservation_fk
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL;
CREATE INDEX idx_payments_reservation ON payments(reservation_id);

-- ─── HORARIOS ESTRUCTURADOS (para "abierto ahora") ─────────────
-- Complementa (no reemplaza) companies.business_hours (texto libre).

CREATE TABLE store_availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  weekday     SMALLINT NOT NULL,
  open_time   TIME,
  close_time  TIME,
  is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT store_availability_weekday_check CHECK (weekday BETWEEN 0 AND 6),
  UNIQUE(company_id, weekday)
);

CREATE INDEX idx_store_availability_company ON store_availability(company_id);

ALTER TABLE store_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_availability_read_public" ON store_availability FOR SELECT
  USING (EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE));
CREATE POLICY "store_availability_owner_all" ON store_availability FOR ALL
  USING (has_store_access(company_id, auth.uid()));
CREATE POLICY "store_availability_admin_all" ON store_availability FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

-- ─── CUPONES QR ──────────────────────────────────────────────

CREATE TABLE qr_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id   UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  code        TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status      TEXT NOT NULL DEFAULT 'issued',
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at     TIMESTAMPTZ,
  CONSTRAINT qr_codes_status_check CHECK (status IN ('issued', 'used'))
);

CREATE INDEX idx_qr_codes_coupon ON qr_codes(coupon_id);
CREATE INDEX idx_qr_codes_user ON qr_codes(user_id);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qr_codes_user_read_own" ON qr_codes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "qr_codes_user_insert" ON qr_codes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "qr_codes_store_read" ON qr_codes FOR SELECT
  USING (EXISTS (SELECT 1 FROM coupons c WHERE c.id = coupon_id AND has_store_access(c.company_id, auth.uid())));
CREATE POLICY "qr_codes_store_redeem" ON qr_codes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM coupons c WHERE c.id = coupon_id AND has_store_access(c.company_id, auth.uid())));
CREATE POLICY "qr_codes_admin_all" ON qr_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));

CREATE TABLE coupon_redemptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id     UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_id      UUID REFERENCES orders(id) ON DELETE SET NULL,
  qr_code_id    UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  redeemed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id);

ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupon_redemptions_user_read_own" ON coupon_redemptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "coupon_redemptions_store_all" ON coupon_redemptions FOR ALL
  USING (EXISTS (SELECT 1 FROM coupons c WHERE c.id = coupon_id AND has_store_access(c.company_id, auth.uid())));
CREATE POLICY "coupon_redemptions_admin_all" ON coupon_redemptions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','super_admin')));
