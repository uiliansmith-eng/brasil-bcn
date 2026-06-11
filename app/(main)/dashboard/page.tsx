import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMyContent } from '@/actions/profile'
import type { Metadata } from 'next'
import { Briefcase, Calendar, ShoppingBag, Building2, Plus, Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Panel de control — BrasilBCN' }

function StatusBadge({ approved, sold }: { approved: boolean; sold?: boolean }) {
  if (sold) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      Vendido
    </span>
  )
  if (approved) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
      <CheckCircle2 className="w-3 h-3" /> Activo
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pendiente
    </span>
  )
}

function EmptyState({ icon: Icon, label, href, cta }: { icon: React.ComponentType<{className?: string}>; label: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-300" />
      </div>
      <p className="text-sm text-gray-400 mb-4">No tienes {label} publicados</p>
      <Link href={href}>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> {cta}
        </Button>
      </Link>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profile, content] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).single().then(r => r.data),
    getMyContent(),
  ])

  if (!profile || !content) redirect('/auth/login')

  const sections = [
    {
      key: 'jobs',
      label: 'Empleos',
      icon: Briefcase,
      items: content.jobs,
      href: '/empleos/publicar',
      cta: 'Publicar empleo',
      detailHref: (id: string) => `/empleos/${id}`,
      renderSub: (item: typeof content.jobs[0]) => item.category,
    },
    {
      key: 'companies',
      label: 'Empresas',
      icon: Building2,
      items: content.companies,
      href: '/empresas/registrar',
      cta: 'Registrar empresa',
      detailHref: (id: string) => `/empresas/${id}`,
      renderSub: (item: typeof content.companies[0]) => item.category,
    },
    {
      key: 'events',
      label: 'Eventos',
      icon: Calendar,
      items: content.events,
      href: '/eventos/publicar',
      cta: 'Publicar evento',
      detailHref: (id: string) => `/eventos/${id}`,
      renderSub: (item: typeof content.events[0]) => new Date(item.date_start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    },
    {
      key: 'listings',
      label: 'Anuncios',
      icon: ShoppingBag,
      items: content.listings,
      href: '/compraventa/publicar',
      cta: 'Publicar anuncio',
      detailHref: (id: string) => `/compraventa/${id}`,
      renderSub: (item: typeof content.listings[0]) => item.price ? `${item.price} €` : 'Sin precio',
    },
  ]

  const totalPending = content.jobs.filter(j => !j.is_approved).length +
    content.events.filter(e => !e.is_approved).length +
    content.listings.filter(l => !l.is_approved).length +
    content.companies.filter(c => !c.is_approved).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Hola, {profile.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Panel de control de tu actividad en BrasilBCN</p>
      </div>

      {/* Pending alert */}
      {totalPending > 0 && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            Tienes <strong>{totalPending} publicación{totalPending > 1 ? 'es' : ''}</strong> pendiente{totalPending > 1 ? 's' : ''} de aprobación. Normalmente se revisan en menos de 24h.
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {sections.map(s => (
          <div key={s.key} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-black text-gray-900">{s.items.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map(s => {
          const Icon = s.icon
          return (
            <div key={s.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <h2 className="font-bold text-sm text-gray-800">{s.label}</h2>
                  <span className="text-xs text-gray-400">({s.items.length})</span>
                </div>
                <Link href={s.href}>
                  <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
                    <Plus className="w-3 h-3" /> {s.cta}
                  </Button>
                </Link>
              </div>

              {s.items.length === 0 ? (
                <EmptyState icon={Icon} label={s.label.toLowerCase()} href={s.href} cta={s.cta} />
              ) : (
                <ul className="divide-y divide-gray-50">
                  {s.items.slice(0, 5).map((item: { id: string; title?: string; name?: string; is_approved: boolean; is_sold?: boolean }) => (
                    <li key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title ?? item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.renderSub(item as never)}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <StatusBadge approved={item.is_approved} sold={'is_sold' in item ? item.is_sold : undefined} />
                        {item.is_approved && (
                          <Link href={s.detailHref(item.id)} className="text-gray-300 hover:text-gray-600 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="mt-8 p-5 bg-[#002776]/5 border border-[#002776]/10 rounded-2xl">
        <p className="text-sm font-semibold text-[#002776] mb-3">Acciones rápidas</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/perfil">
            <Button variant="outline" size="sm" className="text-xs">Editar perfil</Button>
          </Link>
          <Link href="/empleos/publicar">
            <Button variant="outline" size="sm" className="text-xs">Publicar empleo</Button>
          </Link>
          <Link href="/empresas/registrar">
            <Button variant="outline" size="sm" className="text-xs">Registrar empresa</Button>
          </Link>
          <Link href="/eventos/publicar">
            <Button variant="outline" size="sm" className="text-xs">Crear evento</Button>
          </Link>
          <Link href="/compraventa/publicar">
            <Button variant="outline" size="sm" className="text-xs">Publicar anuncio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
