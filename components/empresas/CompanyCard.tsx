import Link from 'next/link'
import { MapPin, CheckCircle2 } from 'lucide-react'
import { COMPANY_CATEGORY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CompanyCardProps {
  company: {
    id: string
    name: string
    slug: string
    description: string | null
    category: string
    logo_url: string | null
    city: string
    is_verified: boolean
    views: number
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurantes: 'bg-orange-50 text-orange-700',
  abogados: 'bg-blue-50 text-blue-700',
  peluquerias: 'bg-pink-50 text-pink-700',
  tiendas: 'bg-green-50 text-green-700',
  construccion: 'bg-yellow-50 text-yellow-700',
  contables: 'bg-purple-50 text-purple-700',
  transporte: 'bg-sky-50 text-sky-700',
  educacion: 'bg-teal-50 text-teal-700',
  salud: 'bg-red-50 text-red-700',
  tecnologia: 'bg-indigo-50 text-indigo-700',
  otro: 'bg-gray-50 text-gray-600',
}

const CATEGORY_EMOJI: Record<string, string> = {
  restaurantes: '🍽️', abogados: '⚖️', peluquerias: '✂️', tiendas: '🛍️',
  construccion: '🏗️', contables: '📊', transporte: '🚗', educacion: '📚',
  salud: '🏥', tecnologia: '💻', otro: '🏢',
}

export function CompanyCard({ company }: CompanyCardProps) {
  const catColor = CATEGORY_COLORS[company.category] ?? CATEGORY_COLORS.otro
  const catEmoji = CATEGORY_EMOJI[company.category] ?? '🏢'
  const catLabel = COMPANY_CATEGORY_LABELS[company.category as keyof typeof COMPANY_CATEGORY_LABELS] ?? company.category

  return (
    <Link
      href={`/empresas/${company.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 hover:border-[#009C3B]/20"
    >
      {/* Logo area */}
      <div className="relative h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        {company.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.logo_url} alt={company.name} className="w-20 h-20 object-contain rounded-xl" />
        ) : (
          <span className="text-5xl">{catEmoji}</span>
        )}
        {company.is_verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm text-xs font-semibold text-[#009C3B]">
            <CheckCircle2 className="w-3 h-3" />
            Verificada
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-[#009C3B] transition-colors leading-tight">
            {company.name}
          </h3>
        </div>

        <span className={cn('self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3', catColor)}>
          {catLabel}
        </span>

        {company.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {company.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            {company.city}
          </div>
          <span className="text-xs text-[#009C3B] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Ver perfil →
          </span>
        </div>
      </div>
    </Link>
  )
}
