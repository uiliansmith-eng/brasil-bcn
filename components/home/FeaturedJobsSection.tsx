import Link from 'next/link'
import { MapPin, Clock, Briefcase, ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getJobs } from '@/actions/jobs'
import { JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import type { JobCategory, JobType } from '@/types'

const categoryColors: Record<string, string> = {
  hosteleria: 'bg-orange-100 text-orange-700',
  construccion: 'bg-yellow-100 text-yellow-700',
  limpieza: 'bg-teal-100 text-teal-700',
  belleza: 'bg-pink-100 text-pink-700',
  transporte: 'bg-blue-100 text-blue-700',
  comercio: 'bg-purple-100 text-purple-700',
  tecnologia: 'bg-indigo-100 text-indigo-700',
  educacion: 'bg-sky-100 text-sky-700',
  salud: 'bg-red-100 text-red-700',
  administracion: 'bg-gray-100 text-gray-700',
  otro: 'bg-gray-100 text-gray-600',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Hace un momento'
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Ayer' : `Hace ${d}d`
}

function formatSalary(min: number | null, max: number | null, visible: boolean): string {
  if (!visible || (!min && !max)) return 'A convenir'
  if (min && max) return `${min.toLocaleString('es-ES')}€ – ${max.toLocaleString('es-ES')}€`
  if (min) return `Desde ${min.toLocaleString('es-ES')}€`
  return `Hasta ${max!.toLocaleString('es-ES')}€`
}

type FeaturedJob = {
  id: string
  title: string
  category: JobCategory
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  salary_visible: boolean
  city: string
  is_urgent: boolean
  created_at: string
  company: { id: string; name: string; slug: string; logo_url: string | null; category: string } | null
}

export async function FeaturedJobsSection() {
  const { jobs } = await getJobs({})
  const featured = (jobs as FeaturedJob[]).slice(0, 4)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#009C3B] font-semibold text-sm uppercase tracking-wider mb-3">
              Últimas ofertas
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Empleos recientes
            </h2>
          </div>
          <Link href="/empleos">
            <Button variant="outline" className="group border-[#009C3B] text-[#009C3B] hover:bg-[#009C3B] hover:text-white transition-all">
              Ver todos los empleos
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-[#009C3B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-[#009C3B]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Aún no hay empleos publicados</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Sé el primero en publicar una oferta de trabajo para la comunidad brasileña en Barcelona.
            </p>
            <Link href="/empleos/publicar">
              <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold">
                <Briefcase className="w-4 h-4 mr-2" />
                Publicar oferta gratis
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map((job) => (
                <Link
                  key={job.id}
                  href={`/empleos/${job.id}`}
                  className="group flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#009C3B]/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {job.company?.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={job.company.logo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#009C3B] transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-gray-500 text-sm">{job.company?.name ?? 'Particular'}</p>
                      </div>
                    </div>
                    {job.is_urgent && (
                      <span className="shrink-0 text-xs font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                        Urgente
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[job.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {JOB_CATEGORY_LABELS[job.category]}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.city}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Briefcase className="w-3.5 h-3.5" />
                      {JOB_TYPE_LABELS[job.job_type]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="font-bold text-[#009C3B] text-sm">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_visible)}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {timeAgo(job.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/empleos/publicar">
                <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold px-8">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Publicar una oferta gratis
                </Button>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  )
}
