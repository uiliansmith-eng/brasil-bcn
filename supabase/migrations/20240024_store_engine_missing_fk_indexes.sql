-- Índices que faltaban en foreign keys del motor de tiendas
-- (detectados por el advisor de performance de Supabase).
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_companies_store_category ON companies(store_category_id);
CREATE INDEX IF NOT EXISTS idx_companies_store_subcategory ON companies(store_subcategory_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_order ON coupon_redemptions(order_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_qr_code ON coupon_redemptions(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON coupon_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_company ON favorites(company_id);
CREATE INDEX IF NOT EXISTS idx_favorites_store_item ON favorites(store_item_id);
CREATE INDEX IF NOT EXISTS idx_order_items_store_item ON order_items(store_item_id);
CREATE INDEX IF NOT EXISTS idx_orders_coupon ON orders(coupon_id);
CREATE INDEX IF NOT EXISTS idx_promotions_store_item ON promotions(store_item_id);
CREATE INDEX IF NOT EXISTS idx_reservations_store_item ON reservations(store_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_store_analytics_user ON store_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_id);
