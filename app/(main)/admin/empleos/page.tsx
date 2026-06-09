import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, ExternalLink } from 'lucide-react'
import { getPendingJobs, approveJobAction, rejectJobAction } from '@/actions/admin'
import { JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'

export const metadata: Metadata = { title: 'Empleos pendientes — Admin' }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

export default async function AdminEmpleosPage() {
  const jobs = await getPendingJobs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Empleos pendientes</h1>
          <p className="text-gray-500 text-sm mt-1">{jobs.length} oferta{jobs.length !== 1 ? 's' : ''} esperando revisión</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todo al día</p>
          <p className="text-gray-400 text-sm">No hay empleos pendientes de revisión</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const poster = job.poster as { full_name?: string } | null
            return (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-[#009C3B]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                    <Link href={`/empleos/${job.id}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 shrink-0" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400">
                    {JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category}
                    {' · '}
                    {JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
                    {' · '}{job.city}
                    {poster?.full_name && ` · por ${poster.full_name}`}
                    {' · '}{timeAgo(job.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={approveJobAction}>
                    <input type="hidden" name="id" value={job.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectJobAction}>
                    <input type="hidden" name="id" value={job.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
