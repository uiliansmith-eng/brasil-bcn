import type { Metadata } from 'next'
import { ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Auditoría — Admin' }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

const ACTION_LABELS: Record<string, string> = {
  company_approved: 'Aprobó',
  company_rejected: 'Rechazó',
  job_approved: 'Aprobó',
  job_rejected: 'Rechazó',
  event_approved: 'Aprobó',
  event_rejected: 'Rechazó',
  guide_published: 'Publicó',
  guide_unpublished: 'Despublicó',
  guide_deleted: 'Eliminó',
  user_blocked: 'Bloqueó',
  user_unblocked: 'Desbloqueó',
  ad_created: 'Creó',
  ad_paused: 'Pausó',
  ad_activated: 'Activó',
  ad_deleted: 'Eliminó',
  home_banner_created: 'Creó banner de portada',
  store_module_enabled: 'Activó módulo en',
  store_module_disabled: 'Desactivó módulo en',
  store_employee_added: 'Añadió empleado a',
  store_employee_removed: 'Quitó empleado de',
}

export default async function AdminAuditoriaPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, actor:profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Auditoría</h1>
        <p className="text-gray-500 text-sm mt-1">Últimas 100 acciones administrativas registradas.</p>
      </div>

      {!logs || logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Todavía no hay acciones registradas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {logs.map((log) => {
            const actor = log.actor as { full_name: string | null; email: string } | null
            return (
              <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                <ClipboardList className="w-4 h-4 text-gray-300 shrink-0" />
                <p className="text-sm text-gray-700 flex-1">
                  <span className="font-semibold">{actor?.full_name ?? actor?.email ?? 'Sistema'}</span>
                  {' '}{ACTION_LABELS[log.action] ?? log.action}
                  {' '}<span className="text-gray-400">{log.entity_type}</span>
                </p>
                <p className="text-xs text-gray-400 shrink-0">{timeAgo(log.created_at)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
