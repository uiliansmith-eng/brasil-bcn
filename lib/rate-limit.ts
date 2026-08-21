import { createClient } from '@/lib/supabase/server'

// Rate limiting a nivel de base de datos (ver migración
// 20240025_rate_limits.sql) — no se puede saltar llamando a la
// Server Action directamente, el propio UPDATE atómico en Postgres
// decide si la petición pasa.
export async function checkRateLimit(key: string, identifier: string, maxCount: number, windowSeconds: number): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_identifier: identifier,
    p_max_count: maxCount,
    p_window_seconds: windowSeconds,
  })

  // Si la propia comprobación falla (ej. red), no bloqueamos al
  // usuario por un problema nuestro — solo protege contra abuso,
  // no es la única capa de seguridad de estas acciones.
  if (error) return true

  return data === true
}
