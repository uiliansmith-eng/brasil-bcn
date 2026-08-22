import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

// RLS de audit_logs exige actor_id = auth.uid() (ver migración
// 20240019), así que esto siempre se llama con la sesión de quien
// ejecuta la acción — nunca con service role.
export async function logAudit(
  supabase: SupabaseServerClient,
  actorId: string,
  action: string,
  entityType: string,
  entityId?: string | null,
  meta?: Record<string, unknown>
) {
  await supabase.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    meta: meta ?? null,
  })
}
