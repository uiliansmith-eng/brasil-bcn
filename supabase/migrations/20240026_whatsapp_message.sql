-- Mensaje automático personalizable de WhatsApp por tienda. NULL =
-- se sigue usando el saludo genérico por defecto en el código.
ALTER TABLE companies ADD COLUMN whatsapp_message TEXT;
