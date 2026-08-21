-- La tabla notifications no tenía política de INSERT para usuarios
-- normales: solo admins podían crear notificaciones. Pero cuando un
-- cliente hace un pedido o una reserva, es SU sesión (no de servicio)
-- la que necesita insertar una notificación dirigida al dueño de la
-- tienda, y viceversa cuando la tienda cambia el estado de un pedido.
-- Mismo patrón que quiz_events (evento informativo, sin impacto en
-- datos sensibles): cualquier usuario autenticado puede insertar,
-- el contenido solo es visible para el destinatario (notifications_user_read_own).
CREATE POLICY "notifications_authenticated_insert" ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
