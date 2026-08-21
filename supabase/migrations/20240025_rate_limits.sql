-- ============================================================
-- RATE LIMITING — requisito de seguridad del spec original que
-- quedaba en cero. Implementado a nivel de base de datos (no en
-- middleware/edge) para que sea imposible de saltarse llamando a
-- la Server Action directamente: el propio UPDATE atómico decide
-- si la petición pasa o no, sin condición de carrera posible.
-- ============================================================

CREATE TABLE rate_limits (
  key           TEXT NOT NULL,
  identifier    TEXT NOT NULL,
  window_start  TIMESTAMPTZ NOT NULL,
  count         INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, identifier, window_start)
);

-- No necesita RLS de usuario: solo se accede vía la función
-- SECURITY DEFINER de abajo, nunca directo desde el cliente.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Sin políticas = nadie puede leer/escribir la tabla directamente
-- (ni siquiera vía RPC de otra función), solo check_rate_limit()
-- puede tocarla porque corre con privilegios del dueño de la función.

CREATE OR REPLACE FUNCTION check_rate_limit(p_key TEXT, p_identifier TEXT, p_max_count INTEGER, p_window_seconds INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  -- Bucket fijo alineado a p_window_seconds (ventana fija, no
  -- deslizante — suficiente para frenar abuso sin más complejidad).
  v_window_start := to_timestamp(floor(extract(epoch FROM NOW()) / p_window_seconds) * p_window_seconds);

  INSERT INTO rate_limits (key, identifier, window_start, count)
  VALUES (p_key, p_identifier, v_window_start, 1)
  ON CONFLICT (key, identifier, window_start)
  DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO v_count;

  -- Limpieza oportunista de ventanas viejas (~1 de cada 200
  -- llamadas) para que la tabla no crezca sin límite, sin necesitar
  -- un cron aparte.
  IF random() < 0.005 THEN
    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 day';
  END IF;

  RETURN v_count <= p_max_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
