import type { Metadata } from 'next'
import Link from 'next/link'
import { Megaphone, Plus, ExternalLink, MousePointerClick, Eye } from 'lucide-react'
import { getAdminAds, toggleAdAction, deleteAdAction } from '@/actions/advertisements'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Publicidad — Admin' }

const POSITION_LABELS: Record<string, string> = {
  home_hero: 'Inicio · Hero',
  jobs_top: 'Empleos · Top',
  companies_top: 'Empresas · Top',
  sidebar: 'Sidebar',
  footer: 'Footer',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function adStatus(ad: { is_active: boolean; starts_at: string; ends_at: string }): 'active' | 'scheduled' | 'expired' | 'paused' {
  if (!ad.is_active) return 'paused'
  const now = new Date()
  if (new Date(ad.ends_at) < now) return 'expired'
  if (new Date(ad.starts_at) > now) return 'scheduled'
  return 'active'
}

const STATUS_STYLES = {
  active: 'bg-green-50 text-green-700',
  scheduled: 'bg-blue-50 text-blue-700',
  expired: 'bg-gray-100 text-gray-500',
  paused: 'bg-amber-50 text-amber-700',
}

const STATUS_LABELS = {
  active: 'Activo',
  scheduled: 'Programado',
  expired: 'Expirado',
  paused: 'Pausado',
}

export default async function AdminPublicidadPage() {
  const ads = await getAdminAds()
  const active = ads.filter((a) => adStatus(a) === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Publicidad</h1>
          <p className="text-gray-500 text-sm mt-1">
            {ads.length} anuncio{ads.length !== 1 ? 's' : ''} · {active} activo{active !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/publicidad/nueva">
          <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
            <Plus className="w-4 h-4" /> Nuevo anuncio
          </Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Sin anuncios</p>
          <p className="text-gray-400 text-sm mb-6">Crea el primer anuncio para monetizar BrasilBCN</p>
          <Link href="/admin/publicidad/nueva">
            <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
              <Plus className="w-4 h-4" /> Nuevo anuncio
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => {
            const status = adStatus(ad)
            return (
              <div key={ad.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-14 h-14 object-contain rounded-xl border border-gray-100 shrink-0 bg-gray-50"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 truncate">{ad.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">{POSITION_LABELS[ad.position] ?? ad.position}</span>
                    <span>{formatDate(ad.starts_at)} → {formatDate(ad.ends_at)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ad.impressions}</span>
                    <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" />{ad.clicks}</span>
                    {ad.clicks > 0 && ad.impressions > 0 && (
                      <span className="text-[#009C3B]">
                        CTR {((ad.clicks / ad.impressions) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={ad.url} target="_blank" rel="noopener noreferrer">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </a>
                  <form action={toggleAdAction}>
                    <input type="hidden" name="id" value={ad.id} />
                    <input type="hidden" name="is_active" value={String(ad.is_active)} />
                    <button type="submit" className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${ad.is_active ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#009C3B] hover:bg-[#007a2f] text-white'}`}>
                      {ad.is_active ? 'Pausar' : 'Activar'}
                    </button>
                  </form>
                  <form action={deleteAdAction}>
                    <input type="hidden" name="id" value={ad.id} />
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      Eliminar
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
