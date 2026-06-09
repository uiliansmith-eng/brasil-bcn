import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Briefcase, Building2, CalendarDays, BookOpen, AlertCircle } from 'lucide-react'
import { getAdminStats } from '@/actions/admin'

export const metadata: Metadata = { title: 'Panel Admin — BrasilBCN' }

function StatCard({
  label, value, sub, icon: Icon, color, href,
}: {
  label: string
  value: number
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href?: string
}) {
  const inner = (
    <div className={`bg-white rounded-2xl border p-6 flex items-center gap-4 ${href ? 'hover:shadow-md transition-shadow' : ''} ${color === 'blue' ? 'border-blue-100' : color === 'green' ? 'border-green-100' : color === 'orange' ? 'border-orange-100' : color === 'purple' ? 'border-purple-100' : 'border-gray-100'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : color === 'orange' ? 'bg-orange-50' : color === 'purple' ? 'bg-purple-50' : 'bg-gray-50'}`}>
        <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'orange' ? 'text-orange-600' : color === 'purple' ? 'text-purple-600' : 'text-gray-600'}`} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value.toLocaleString('es-ES')}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function PendingAlert({ label, count, href }: { label: string; count: number; href: string }) {
  if (count === 0) return null
  return (
    <Link href={href} className="flex items-center justify-between gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-sm font-medium text-amber-800">
          {count} {label} pendiente{count !== 1 ? 's' : ''} de revisión
        </span>
      </div>
      <span className="text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">{count}</span>
    </Link>
  )
}

export default async function AdminPage() {
  const stats = await getAdminStats()
  const totalPending = stats.jobs.pending + stats.companies.pending + stats.events.pending

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Vista general de BrasilBCN</p>
      </div>

      {/* Pending alerts */}
      {totalPending > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Requieren revisión</p>
          <PendingAlert label="empleo" count={stats.jobs.pending} href="/admin/empleos" />
          <PendingAlert label="empresa" count={stats.companies.pending} href="/admin/empresas" />
          <PendingAlert label="evento" count={stats.events.pending} href="/admin/eventos" />
        </div>
      )}

      {totalPending === 0 && (
        <div className="flex items-center gap-2.5 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium text-green-800">Todo al día — no hay contenido pendiente</span>
        </div>
      )}

      {/* Stats grid */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Totales</p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard label="Usuarios registrados" value={stats.users} icon={Users} color="blue" />
          <StatCard label="Empleos activos" value={stats.jobs.total} sub={`${stats.jobs.pending} pendientes`} icon={Briefcase} color="green" href="/admin/empleos" />
          <StatCard label="Empresas" value={stats.companies.total} sub={`${stats.companies.pending} pendientes`} icon={Building2} color="orange" href="/admin/empresas" />
          <StatCard label="Eventos" value={stats.events.total} sub={`${stats.events.pending} pendientes`} icon={CalendarDays} color="purple" href="/admin/eventos" />
          <StatCard label="Guías" value={stats.guides.total} sub={`${stats.guides.published} publicadas`} icon={BookOpen} color="blue" href="/admin/guias" />
        </div>
      </div>
    </div>
  )
}
