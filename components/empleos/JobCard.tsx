import Link from 'next/link'
import { MapPin, Clock, Building2, Zap } from 'lucide-react'
import { formatSalary, JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job & {
    company?: { id: string; name: string; slug: string; logo_url: string | null; category: string } | null
  }
  featured?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  hosteleria: 'bg-orange-50 text-orange-700 border-orange-100',
  construccion: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  limpieza: 'bg-teal-50 text-teal-700 border-teal-100',
  belleza: 'bg-pink-50 text-pink-700 border-pink-100',
  transporte: 'bg-blue-50 text-blue-700 border-blue-100',
  comercio: 'bg-purple-50 text-purple-700 border-purple-100',
  tecnologia: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  educacion: 'bg-sky-50 text-sky-700 border-sky-100',
  salud: 'bg-red-50 text-red-700 border-red-100',
  administracion: 'bg-gray-50 text-gray-700 border-gray-100',
  otro: 'bg-gray-50 text-gray-600 border-gray-100',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1) return 'Hace menos de 1h'
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hace 1 día'
  if (days < 7) return `Hace ${days} días`
  return `Hace ${Math.floor(days / 7)} sem.`
}

export function JobCard({ job, featured = false }: JobCardProps) {
  const categoryColor = CATEGORY_COLORS[job.category] ?? CATEGORY_COLORS.otro
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_visible)

  return (
    <Link
      href={`/empleos/${job.id}`}
      className={cn(
        'group flex flex-col gap-4 bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
        featured
          ? 'border-[#009C3B]/30 shadow-sm ring-1 ring-[#009C3B]/10'
          : 'border-gray-100 hover:border-[#009C3B]/30',
        job.is_urgent && 'border-l-4 border-l-red-400'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Company logo or icon */}
          <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-[#009C3B]/20 transition-colors">
            {job.company?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.company.logo_url} alt={job.company.name} className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-[#009C3B] transition-colors leading-tight truncate">
              {job.title}
            </h3>
            <p className="text-gray-500 text-sm truncate">
              {job.company?.name ?? 'Empresa confidencial'}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {job.is_urgent && (
            <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3" /> Urgente
            </span>
          )}
          {featured && (
            <span className="text-xs font-bold bg-[#009C3B]/10 text-[#009C3B] px-2 py-0.5 rounded-full">
              Destacado
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', categoryColor)}>
          {JOB_CATEGORY_LABELS[job.category]}
        </span>
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {JOB_TYPE_LABELS[job.job_type]}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{job.location ? `${job.location}, ${job.city}` : job.city}</span>
        </div>
        {salary !== 'A convenir' && (
          <div className="flex items-center gap-1.5 text-[#009C3B] font-semibold text-sm">
            <span>{salary}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        {salary === 'A convenir' ? (
          <span className="text-gray-400 text-sm italic">Salario a convenir</span>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1 text-gray-400 text-xs ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(job.created_at)}
        </div>
      </div>
    </Link>
  )
}
