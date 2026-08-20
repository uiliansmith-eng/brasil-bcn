import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Building2, MapPin, Clock, Mail, MessageCircle, Zap } from 'lucide-react'
import { getJobForAdmin, approveJobAction, rejectJobAction } from '@/actions/admin'
import { formatSalary, JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Revisar empleo — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminJobDetailPage({ params }: PageProps) {
  const { id } = await params
  const job = await getJobForAdmin(id)
  if (!job) notFound()

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_visible)
  const poster = job.poster as { full_name?: string; email?: string } | null
  const company = job.company as { name?: string; city?: string; whatsapp?: string; website?: string } | null

  return (
    <div className="space-y-6">
      <Link
        href="/admin/empleos"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a pendientes
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#009C3B]/10 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-[#009C3B]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{job.title}</h1>
              {job.is_urgent && (
                <span className="flex items-center gap-1 text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full shrink-0">
                  <Zap className="w-3.5 h-3.5" /> Urgente
                </span>
              )}
            </div>
            <p className="text-gray-600 font-medium">
              {company?.name ?? 'Empresa confidencial'}
              {poster?.full_name && (
                <span className="text-gray-400 font-normal"> · publicado por {poster.full_name}{poster.email && ` (${poster.email})`}</span>
              )}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            { icon: MapPin, label: job.location ? `${job.location}, ${job.city}` : job.city },
            { icon: Briefcase, label: JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type },
            { icon: Clock, label: `Publicado el ${formatDate(job.created_at)}` },
            ...(salary !== 'A convenir' ? [{ icon: null, label: salary, highlight: true }] : []),
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm ${item.highlight ? 'text-[#009C3B] font-bold' : 'text-gray-500'}`}>
              {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-semibold bg-[#009C3B]/10 text-[#009C3B] px-3 py-1.5 rounded-full">
            {JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category}
          </span>
          <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
            {JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
          <form action={approveJobAction}>
            <input type="hidden" name="id" value={job.id} />
            <button type="submit" className="px-5 py-2 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
              Aprobar oferta
            </button>
          </form>
          <form action={rejectJobAction}>
            <input type="hidden" name="id" value={job.id} />
            <button type="submit" className="px-5 py-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
              Rechazar
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-lg font-black text-gray-900 mb-4">Descripción del puesto</h2>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {job.requirements && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-lg font-black text-gray-900 mb-4">Requisitos</h2>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
        </div>
      )}

      {job.benefits && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-lg font-black text-gray-900 mb-4">¿Qué ofrecemos?</h2>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.benefits}</div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-lg font-black text-gray-900 mb-4">Contacto y empresa</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {job.whatsapp && (
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-4 h-4 text-gray-400" /> {job.whatsapp}
            </div>
          )}
          {job.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" /> {job.email}
            </div>
          )}
          {company?.name && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400" /> {company.name}{company.city && ` · ${company.city}`}
            </div>
          )}
          {!job.whatsapp && !job.email && !company?.name && (
            <p className="text-gray-400">Sin datos de contacto</p>
          )}
        </div>
      </div>
    </div>
  )
}
