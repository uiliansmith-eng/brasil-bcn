import Link from 'next/link'
import { MapPin, Clock, Building2, Zap, ExternalLink } from 'lucide-react'
import { formatSalary, JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type JobSource = 'brasil_bcn' | 'adzuna' | 'jooble' | string

interface JobCardJob {
  id: string
  title: string
  category: string
  job_type: string
  city: string
  location?: string | null
  salary_min?: number | null
  salary_max?: number | null
  salary_visible?: boolean
  is_urgent?: boolean
  created_at: string
  source?: JobSource
  source_url?: string | null
  company_name?: string | null
  company?: { id: string; name: string; slug: string; logo_url: string | null; category: string } | null
}

interface JobCardProps {
  job: JobCardJob
  featured?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  hosteleria:    'bg-orange-50 text-orange-700 border-orange-100',
  construccion:  'bg-yellow-50 text-yellow-700 border-yellow-100',
  limpieza:      'bg-teal-50 text-teal-700 border-teal-100',
  belleza:       'bg-pink-50 text-pink-700 border-pink-100',
  transporte:    'bg-blue-50 text-blue-700 border-blue-100',
  comercio:      'bg-purple-50 text-purple-700 border-purple-100',
  tecnologia:    'bg-indigo-50 text-indigo-700 border-indigo-100',
  educacion:     'bg-sky-50 text-sky-700 border-sky-100',
  salud:         'bg-red-50 text-red-700 border-red-100',
  administracion:'bg-gray-50 text-gray-700 border-gray-100',
  otro:          'bg-gray-50 text-gray-600 border-gray-100',
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

function SourceBadge({ source }: { source: JobSource }) {
  if (source === 'brasil_bcn') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#009C3B]/10 text-[#009C3B] px-2 py-0.5 rounded-full border border-[#009C3B]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#009C3B] animate-pulse" />
        BrasilBCN
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
      <ExternalLink className="w-2.5 h-2.5" />
      {source === 'adzuna' ? 'Adzuna' : source === 'jooble' ? 'Jooble' : 'Externo'}
    </span>
  )
}

export function JobCard({ job, featured = false }: JobCardProps) {
  const source: JobSource = job.source ?? 'brasil_bcn'
  const isImported = source !== 'brasil_bcn'
  const categoryColor = CATEGORY_COLORS[job.category] ?? CATEGORY_COLORS.otro
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_visible ?? true)
  const displayName = job.company_name ?? job.company?.name ?? null
  const logoUrl = job.company?.logo_url ?? null

  const cardInner = (
    <div
      className={cn(
        'group flex flex-col gap-4 bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full',
        featured
          ? 'border-[#009C3B]/30 shadow-sm ring-1 ring-[#009C3B]/10'
          : isImported
            ? 'border-gray-100 hover:border-blue-200'
            : 'border-gray-100 hover:border-[#009C3B]/30',
        job.is_urgent && 'border-l-4 border-l-red-400'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            'w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors',
            isImported
              ? 'bg-gray-50 border-gray-100'
              : 'bg-gray-50 border-gray-100 group-hover:border-[#009C3B]/20'
          )}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={displayName ?? ''} className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className={cn(
              'font-bold text-gray-900 transition-colors leading-tight truncate',
              isImported ? 'group-hover:text-blue-600' : 'group-hover:text-[#009C3B]'
            )}>
              {job.title}
            </h3>
            <p className="text-gray-500 text-sm truncate">
              {displayName ?? 'Empresa confidencial'}
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
          {featured && !isImported && (
            <span className="text-xs font-bold bg-[#009C3B]/10 text-[#009C3B] px-2 py-0.5 rounded-full">
              Destacado
            </span>
          )}
          <SourceBadge source={source} />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', categoryColor)}>
          {JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category}
        </span>
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
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
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
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
    </div>
  )

  if (isImported && job.source_url) {
    return (
      <a
        href={job.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardInner}
      </a>
    )
  }

  return (
    <Link href={`/empleos/${job.id}`} className="block">
      {cardInner}
    </Link>
  )
}
