import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Briefcase, Building2, CalendarDays, BookOpen, Share2, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GroupCard } from '@/components/comunidad/GroupCard'
import { getCommunityStats, getRecentActivity } from '@/actions/community'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/config'
import { COMMUNITY_GROUPS } from '@/lib/community-groups'
import { JOB_CATEGORY_LABELS, JOB_TYPE_LABELS, EVENT_CATEGORY_LABELS } from '@/lib/constants'

export const metadata: Metadata = buildMetadata({
  title: 'Comunidad brasileña en Barcelona — BrasilBCN',
  description: 'Grupos de WhatsApp, actividad reciente y recursos para la comunidad brasileña en Barcelona y Cataluña.',
  path: '/comunidad',
  keywords: ['comunidad brasileña Barcelona', 'grupos whatsapp brasileños Barcelona', 'brasileños en España'],
})

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Hace un momento'
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  return `Hace ${d}d`
}

export default async function ComunidadPage() {
  const [stats, activity] = await Promise.all([
    getCommunityStats(),
    getRecentActivity(),
  ])

  const totalGroupMembers = COMMUNITY_GROUPS.reduce((sum, g) => sum + g.members, 0)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] via-[#002776] to-[#001540] pt-24 pb-16 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFDF00]/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#009C3B]/8 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-medium">Comunidad · BrasilBCN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            A comunidade brasileira<br />
            <span className="text-[#FFDF00]">em Barcelona</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mb-10">
            Grupos de WhatsApp, empleos, eventos y recursos para brasileños en Cataluña. Unidos somos mais.
          </p>

          {/* Live stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { icon: Users, value: stats.users.toLocaleString('es-ES'), label: 'Miembros' },
              { icon: Building2, value: stats.companies.toLocaleString('es-ES'), label: 'Empresas' },
              { icon: Briefcase, value: stats.jobs.toLocaleString('es-ES'), label: 'Empleos' },
              { icon: CalendarDays, value: stats.events.toLocaleString('es-ES'), label: 'Eventos' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <Icon className="w-5 h-5 text-[#FFDF00] mb-2" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-blue-200 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* WhatsApp Groups */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <h2 className="text-2xl font-black text-gray-900">Grupos de WhatsApp</h2>
              </div>
              <p className="text-gray-500">
                {totalGroupMembers.toLocaleString('es-ES')} miembros en {COMMUNITY_GROUPS.length} grupos temáticos
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITY_GROUPS.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        {(activity.jobs.length > 0 || activity.events.length > 0) && (
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-8">Actividad reciente</h2>
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Latest jobs */}
              {activity.jobs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#009C3B]" />
                      <h3 className="font-bold text-gray-900">Últimas ofertas</h3>
                    </div>
                    <Link href="/empleos" className="text-sm font-medium text-[#009C3B] hover:text-[#007a2f] flex items-center gap-1 transition-colors">
                      Ver todas <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {activity.jobs.map((job) => {
                      const company = job.company as { name?: string; logo_url?: string } | null
                      return (
                        <Link
                          key={job.id}
                          href={`/empleos/${job.id}`}
                          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#009C3B]/30 hover:shadow-sm transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {company?.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={company.logo_url} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Briefcase className="w-4 h-4 text-[#009C3B]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#009C3B] transition-colors">
                              {job.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {JOB_CATEGORY_LABELS[job.category as keyof typeof JOB_CATEGORY_LABELS] ?? job.category}
                              {' · '}{JOB_TYPE_LABELS[job.job_type as keyof typeof JOB_TYPE_LABELS] ?? job.job_type}
                              {' · '}{timeAgo(job.created_at)}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming events */}
              {activity.events.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-purple-600" />
                      <h3 className="font-bold text-gray-900">Próximos eventos</h3>
                    </div>
                    <Link href="/eventos" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors">
                      Ver todos <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {activity.events.map((event) => (
                      <Link
                        key={event.id}
                        href={`/eventos/${event.slug}`}
                        className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {event.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <CalendarDays className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-purple-600 transition-colors">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {EVENT_CATEGORY_LABELS[event.category as keyof typeof EVENT_CATEGORY_LABELS] ?? event.category}
                            {' · '}{formatEventDate(event.date_start)}
                            {(event.is_free || !event.price) && ' · Gratis'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Social & Connect */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-8">Síguenos y conecta</h2>
          <div className="grid sm:grid-cols-3 gap-5">

            {/* Instagram */}
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Share2 className="w-10 h-10" />
              <div className="text-center">
                <p className="font-black text-xl">@brasilbcn</p>
                <p className="text-white/80 text-sm mt-1">Fotos, stories y novedades</p>
              </div>
              <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                Seguir
              </span>
            </a>

            {/* WhatsApp main */}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 bg-[#25D366] rounded-2xl text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <MessageCircle className="w-10 h-10" />
              <div className="text-center">
                <p className="font-black text-xl">WhatsApp</p>
                <p className="text-white/80 text-sm mt-1">Contacta con nosotros directamente</p>
              </div>
              <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                Escribir
              </span>
            </a>

            {/* Guides */}
            <Link
              href="/guia"
              className="group flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-[#002776] to-[#001540] rounded-2xl text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <BookOpen className="w-10 h-10 text-[#FFDF00]" />
              <div className="text-center">
                <p className="font-black text-xl">Guía BCN</p>
                <p className="text-white/80 text-sm mt-1">{stats.guides} guías para vivir en España</p>
              </div>
              <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                Explorar
              </span>
            </Link>
          </div>
        </section>

        {/* CTA — register */}
        <section className="bg-gradient-to-br from-[#009C3B] to-[#007a2f] rounded-3xl p-10 sm:p-14 text-center">
          <div className="text-5xl mb-5">🇧🇷</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            ¿Tienes una empresa o negocio?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Registra tu empresa gratis y llega a toda la comunidad brasileña en Cataluña.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/empresas/registrar">
              <Button className="bg-white hover:bg-gray-50 text-[#009C3B] font-bold px-8 h-12">
                Registrar empresa
              </Button>
            </Link>
            <Link href="/empleos/publicar">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12">
                Publicar empleo
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
