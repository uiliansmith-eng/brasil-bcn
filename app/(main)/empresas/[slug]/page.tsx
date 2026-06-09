import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Globe, Phone, MessageCircle, Mail, CheckCircle2, Briefcase, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCompanyBySlug } from '@/actions/companies'
import { COMPANY_CATEGORY_LABELS, JOB_TYPE_LABELS, formatSalary } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  if (!company) return { title: 'Empresa no encontrada' }

  return {
    title: `${company.name} — ${COMPANY_CATEGORY_LABELS[company.category as keyof typeof COMPANY_CATEGORY_LABELS] ?? company.category} en Barcelona`,
    description: company.description?.slice(0, 160) ?? `${company.name} en Barcelona`,
  }
}

const CATEGORY_EMOJI: Record<string, string> = {
  restaurantes: '🍽️', abogados: '⚖️', peluquerias: '✂️', tiendas: '🛍️',
  construccion: '🏗️', contables: '📊', transporte: '🚗', educacion: '📚',
  salud: '🏥', tecnologia: '💻', otro: '🏢',
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  if (!company) notFound()

  const catLabel = COMPANY_CATEGORY_LABELS[company.category as keyof typeof COMPANY_CATEGORY_LABELS] ?? company.category
  const catEmoji = CATEGORY_EMOJI[company.category] ?? '🏢'
  const whatsappUrl = company.whatsapp
    ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${company.name}! Te encontré en BrasilBCN.`)}`
    : null

  interface JobRow { id: string; title: string; job_type: string; salary_min: number | null; salary_max: number | null; salary_visible: boolean; is_active: boolean; is_approved: boolean; expires_at: string }
  const activeJobs = ((company.jobs ?? []) as JobRow[]).filter(
    (j) => j.is_active && j.is_approved && new Date(j.expires_at) > new Date()
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/empresas" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al directorio
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* Main */}
          <div className="space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Cover */}
              <div className="h-36 bg-gradient-to-br from-[#002776]/10 to-[#009C3B]/10 flex items-center justify-center relative">
                {company.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl opacity-30">{catEmoji}</span>
                )}
              </div>

              <div className="px-8 pb-8">
                {/* Logo */}
                <div className="flex items-end gap-4 -mt-10 mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                    {company.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <span>{catEmoji}</span>
                    )}
                  </div>
                  {company.is_verified && (
                    <div className="mb-2 flex items-center gap-1.5 bg-green-50 text-[#009C3B] text-sm font-semibold px-3 py-1.5 rounded-full border border-green-100">
                      <CheckCircle2 className="w-4 h-4" /> Empresa verificada
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-black text-gray-900 mb-1">{company.name}</h1>

                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-sm font-semibold bg-[#002776]/10 text-[#002776] px-3 py-1.5 rounded-full">
                    {catLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {company.address ? `${company.address}, ${company.city}` : company.city}
                  </div>
                </div>

                {company.description && (
                  <p className="text-gray-600 leading-relaxed">{company.description}</p>
                )}
              </div>
            </div>

            {/* Gallery */}
            {company.gallery && company.gallery.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-4">Galería</h2>
                <div className="grid grid-cols-3 gap-3">
                  {company.gallery.map((img: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}

            {/* Jobs from this company */}
            {activeJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-5">
                  Empleos activos ({activeJobs.length})
                </h2>
                <div className="space-y-3">
                  {activeJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/empleos/${job.id}`}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#009C3B]/30 hover:bg-green-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#009C3B]/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-[#009C3B]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-[#009C3B] transition-colors">
                            {job.title}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
                            {' · '}{formatSalary(job.salary_min, job.salary_max, job.salary_visible)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#009C3B] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-black text-gray-900 text-lg mb-5">Contacto</h3>

              <div className="space-y-3 mb-5">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold gap-2">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                )}
                {company.phone && (
                  <a href={`tel:${company.phone}`}>
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Phone className="w-4 h-4" /> {company.phone}
                    </Button>
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`}>
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Mail className="w-4 h-4" /> Email
                    </Button>
                  </a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Globe className="w-4 h-4" /> Web
                    </Button>
                  </a>
                )}
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-1.5">
                {[
                  `${company.views ?? 0} visualizaciones`,
                  company.address && `${company.address}, ${company.city}`,
                ].filter(Boolean).map((info) => (
                  <p key={info as string} className="text-gray-400 text-xs">{info}</p>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: company.name,
            description: company.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: company.address,
              addressLocality: company.city,
              addressCountry: 'ES',
            },
            telephone: company.phone,
            email: company.email,
            url: company.website,
          }),
        }}
      />
    </div>
  )
}
