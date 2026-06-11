import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Briefcase, Building2, MessageCircle, Mail, Zap, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getJobById } from '@/actions/jobs'
import { formatSalary, JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) return { title: 'Empleo no encontrado — BrasilBCN' }

  const company = job.company as { name?: string; logo_url?: string } | null
  const category = JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category

  return buildMetadata({
    title: `${job.title} — ${company?.name ?? 'Empresa confidencial'}`,
    description: `${category} · ${job.city} · ${job.description.slice(0, 120)}`,
    path: `/empleos/${id}`,
    image: company?.logo_url ?? undefined,
    type: 'article',
    keywords: [job.title, category, job.city, 'empleo Barcelona brasileños'],
  })
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) notFound()

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_visible)
  const whatsappUrl = job.whatsapp
    ? `https://wa.me/${job.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi tu oferta de trabajo "${job.title}" en BrasilBCN y me interesa.`)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <Link
          href="/empleos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a empleos
        </Link>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* Main content */}
          <div className="space-y-6">

            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">{job.title}</h1>
                    {job.is_urgent && (
                      <span className="flex items-center gap-1 text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full shrink-0">
                        <Zap className="w-3.5 h-3.5" /> Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium text-lg">
                    {job.company?.name ?? 'Empresa confidencial'}
                  </p>
                </div>
              </div>

              {/* Meta info */}
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

              {/* Category tag */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold bg-[#009C3B]/10 text-[#009C3B] px-3 py-1.5 rounded-full">
                  {JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category}
                </span>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  {JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-lg font-black text-gray-900 mb-4">Descripción del puesto</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-4">Requisitos</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-4">¿Qué ofrecemos?</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Apply card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-black text-gray-900 text-lg mb-2">¿Te interesa?</h3>
              {salary !== 'A convenir' && (
                <p className="text-2xl font-black text-[#009C3B] mb-4">{salary}</p>
              )}

              <div className="space-y-3 mb-5">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contactar por WhatsApp
                    </Button>
                  </a>
                )}
                {job.email && (
                  <a href={`mailto:${job.email}?subject=Solicitud para "${job.title}" vía BrasilBCN`}>
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Mail className="w-4 h-4" />
                      Enviar email
                    </Button>
                  </a>
                )}
                {!whatsappUrl && !job.email && (
                  <p className="text-gray-400 text-sm text-center py-2">
                    Contacto no disponible
                  </p>
                )}
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-2">
                {[
                  `Publicado: ${formatDate(job.created_at)}`,
                  `Expira: ${formatDate(job.expires_at)}`,
                  `${job.views} visualizaciones`,
                ].map((info) => (
                  <p key={info} className="text-gray-400 text-xs">{info}</p>
                ))}
              </div>
            </div>

            {/* Company card */}
            {job.company && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">Empresa</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{job.company.name}</p>
                    <p className="text-gray-500 text-sm">{job.company.city}</p>
                  </div>
                </div>
                <Link href={`/empresas/${job.company.slug}`}>
                  <Button variant="outline" size="sm" className="w-full text-sm">
                    Ver perfil de empresa
                  </Button>
                </Link>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="font-bold text-gray-700 text-sm mb-3">Compartir esta oferta</p>
              <button
                onClick={() => typeof navigator !== 'undefined' && navigator.share?.({ title: job.title, url: window.location.href })}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: job.description,
            datePosted: job.created_at,
            validThrough: job.expires_at,
            jobLocation: {
              '@type': 'Place',
              address: { '@type': 'PostalAddress', addressLocality: job.city, addressCountry: 'ES' },
            },
            hiringOrganization: {
              '@type': 'Organization',
              name: job.company?.name ?? 'Empresa confidencial',
            },
            ...(job.salary_min && {
              baseSalary: {
                '@type': 'MonetaryAmount',
                currency: 'EUR',
                value: { '@type': 'QuantitativeValue', minValue: job.salary_min, maxValue: job.salary_max ?? job.salary_min, unitText: 'MONTH' },
              },
            }),
          }),
        }}
      />
    </div>
  )
}
