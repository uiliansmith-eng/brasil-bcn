import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Calendar, ShoppingBag, Building2, Plus, Settings, MapPin, Map } from 'lucide-react'
import { getMyContent } from '@/actions/profile'
import { ProfileForm } from './ProfileForm'

export const metadata: Metadata = { title: 'Mi perfil — BrasilBCN' }

const roleLabels: Record<string, string> = {
  user: 'Miembro',
  company: 'Empresa',
  admin: 'Admin',
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const content = await getMyContent()
  const stats = [
    { label: 'Empleos', count: content?.jobs.length ?? 0, href: '/empleos/publicar', icon: Briefcase, cta: 'Publicar empleo' },
    { label: 'Empresas', count: content?.companies.length ?? 0, href: '/empresas/registrar', icon: Building2, cta: 'Registrar empresa' },
    { label: 'Eventos', count: content?.events.length ?? 0, href: '/eventos/publicar', icon: Calendar, cta: 'Crear evento' },
    { label: 'Anuncios', count: content?.listings.length ?? 0, href: '/compraventa/publicar', icon: ShoppingBag, cta: 'Publicar anuncio' },
  ]

  const memberSince = new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-[#002776] via-[#009C3B] to-[#FFDF00]" />
        <div className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#009C3B] flex items-center justify-center text-white text-xl font-black shrink-0">
            {profile.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 truncate">{profile.full_name}</h1>
            <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#009C3B]/10 text-[#009C3B]">
                {roleLabels[profile.role] ?? profile.role}
              </span>
              {profile.city && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {profile.city}
                </span>
              )}
              <span className="text-xs text-gray-400">Miembro desde {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, count, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <Icon className="w-4 h-4 text-gray-300 mx-auto mb-1" />
            <p className="text-xl font-black text-gray-900">{count}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#002776]/5 border border-[#002776]/10 rounded-2xl p-5 mb-6">
        <p className="text-sm font-bold text-[#002776] mb-3">Publicar en BrasilBCN</p>
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ cta, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-gray-100 text-sm font-medium text-gray-700 hover:border-[#002776]/30 hover:text-[#002776] transition-all group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#002776] transition-colors shrink-0" />
              <span className="truncate">{cta}</span>
              <Plus className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-[#002776] shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
        {(content?.jobs.length ?? 0) + (content?.listings.length ?? 0) + (content?.events.length ?? 0) + (content?.companies.length ?? 0) > 0 && (
          <Link
            href="/dashboard"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#002776] font-semibold hover:underline"
          >
            <Settings className="w-3.5 h-3.5" /> Ver todas mis publicaciones
          </Link>
        )}
      </div>

      {/* Ruta CTA */}
      <Link
        href="/ruta-brasileno"
        className="flex items-center gap-4 bg-gradient-to-r from-[#002776] to-[#003d9e] rounded-2xl p-5 mb-6 hover:opacity-95 transition-opacity"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Map className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-sm">Ruta del Brasileño</p>
          <p className="text-blue-200 text-xs mt-0.5">Guía paso a paso para organizarte en Barcelona</p>
        </div>
        <span className="text-white/60 text-lg">→</span>
      </Link>

      {/* Edit form */}
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-900 mb-4">Editar información</h2>
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
