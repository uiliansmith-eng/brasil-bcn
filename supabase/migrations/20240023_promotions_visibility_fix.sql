-- promotions_read_public solo comprobaba is_active=true, sin
-- verificar que la tienda asociada siga activa/aprobada (a
-- diferencia de store_items, coupons, reviews, etc.). Una promoción
-- podía seguir siendo pública aunque la tienda fuera suspendida.
-- company_id puede ser NULL (banner de plataforma sin tienda
-- asociada), en cuyo caso no aplica el chequeo de tienda.
DROP POLICY "promotions_read_public" ON promotions;

CREATE POLICY "promotions_read_public" ON promotions FOR SELECT
  USING (
    is_active = TRUE
    AND (
      company_id IS NULL
      OR EXISTS (SELECT 1 FROM companies c WHERE c.id = company_id AND c.is_active = TRUE AND c.is_approved = TRUE)
    )
  );
