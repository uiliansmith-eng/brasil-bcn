import type { JobCategory, JobType, CompanyCategory, EventCategory, GuideCategory, ListingCategory, ListingCondition } from '@/types'

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Jornada completa',
  part_time: 'Media jornada',
  freelance: 'Freelance',
  internship: 'Prácticas',
  temporary: 'Temporal',
}

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  hosteleria: 'Hostelería',
  construccion: 'Construcción',
  limpieza: 'Limpieza',
  belleza: 'Belleza',
  transporte: 'Transporte',
  comercio: 'Comercio',
  tecnologia: 'Tecnología',
  educacion: 'Educación',
  salud: 'Salud',
  administracion: 'Administración',
  otro: 'Otro',
}

export const COMPANY_CATEGORY_LABELS: Record<CompanyCategory, string> = {
  restaurantes: 'Restaurantes',
  abogados: 'Abogados',
  peluquerias: 'Peluquerías',
  construccion: 'Construcción',
  contables: 'Contables',
  tiendas: 'Tiendas',
  transporte: 'Transporte',
  educacion: 'Educación',
  salud: 'Salud',
  tecnologia: 'Tecnología',
  otro: 'Otro',
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  fiesta: 'Fiestas',
  cultura: 'Cultura',
  deporte: 'Deporte',
  networking: 'Networking',
  gastronomia: 'Gastronomía',
  arte: 'Arte',
  musica: 'Música',
  otro: 'Otro',
}

export const EVENT_CATEGORY_EMOJI: Record<EventCategory, string> = {
  fiesta: '🎉',
  cultura: '🎭',
  deporte: '⚽',
  networking: '🤝',
  gastronomia: '🍽️',
  arte: '🎨',
  musica: '🎵',
  otro: '📅',
}

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  nie: 'NIE',
  empadronamiento: 'Empadronamiento',
  autonomos: 'Autónomos',
  seguridad_social: 'Seguridad Social',
  bancos: 'Bancos',
  vivienda: 'Vivienda',
  educacion: 'Educación',
  sanidad: 'Sanidad',
  otro: 'Otro',
}

export const GUIDE_CATEGORY_EMOJI: Record<GuideCategory, string> = {
  nie: '🪪',
  empadronamiento: '🏠',
  autonomos: '💼',
  seguridad_social: '🏥',
  bancos: '🏦',
  vivienda: '🔑',
  educacion: '📚',
  sanidad: '⚕️',
  otro: '📋',
}

export const GUIDE_CATEGORY_COLORS: Record<GuideCategory, string> = {
  nie: 'bg-blue-50 text-blue-700',
  empadronamiento: 'bg-green-50 text-green-700',
  autonomos: 'bg-orange-50 text-orange-700',
  seguridad_social: 'bg-red-50 text-red-700',
  bancos: 'bg-yellow-50 text-yellow-700',
  vivienda: 'bg-teal-50 text-teal-700',
  educacion: 'bg-purple-50 text-purple-700',
  sanidad: 'bg-pink-50 text-pink-700',
  otro: 'bg-gray-50 text-gray-600',
}

export const JOB_CATEGORY_EMOJI: Record<JobCategory, string> = {
  hosteleria: '🍽️',
  construccion: '🏗️',
  limpieza: '🧹',
  belleza: '✂️',
  transporte: '🚗',
  comercio: '🛍️',
  tecnologia: '💻',
  educacion: '📚',
  salud: '🏥',
  administracion: '📋',
  otro: '💼',
}

export const BARCELONA_DISTRICTS = [
  'Eixample',
  'Gràcia',
  'Sant Martí',
  'Sants-Montjuïc',
  'Horta-Guinardó',
  'Nou Barris',
  'Sant Andreu',
  'Sarrià-Sant Gervasi',
  'Les Corts',
  'Ciutat Vella',
  'Poble Sec',
  'Poblenou',
]

export const CITIES = ['Barcelona', 'Badalona', 'L\'Hospitalet', 'Terrassa', 'Sabadell', 'Mataró', 'Girona']

export const LISTING_CATEGORY_LABELS: Record<ListingCategory, string> = {
  electronica: 'Electrónica',
  muebles: 'Muebles',
  ropa: 'Ropa',
  vehiculos: 'Vehículos',
  libros: 'Libros',
  deportes: 'Deportes',
  hogar: 'Hogar',
  bebes: 'Bebés',
  otro: 'Otro',
}

export const LISTING_CATEGORY_EMOJI: Record<ListingCategory, string> = {
  electronica: '📱',
  muebles: '🪑',
  ropa: '👕',
  vehiculos: '🚗',
  libros: '📚',
  deportes: '⚽',
  hogar: '🏠',
  bebes: '🍼',
  otro: '📦',
}

export const LISTING_CONDITION_LABELS: Record<ListingCondition, string> = {
  nuevo: 'Nuevo',
  como_nuevo: 'Como nuevo',
  buen_estado: 'Buen estado',
  aceptable: 'Aceptable',
}

export const LISTING_CONDITION_COLORS: Record<ListingCondition, string> = {
  nuevo: 'bg-green-50 text-green-700',
  como_nuevo: 'bg-teal-50 text-teal-700',
  buen_estado: 'bg-blue-50 text-blue-700',
  aceptable: 'bg-orange-50 text-orange-700',
}

export function formatPrice(price?: number | null, negotiable?: boolean): string {
  if (!price) return negotiable ? 'A convenir' : 'Gratis'
  const formatted = price.toLocaleString('es-ES')
  return negotiable ? `${formatted}€ (negociable)` : `${formatted}€`
}

export function formatSalary(min?: number | null, max?: number | null, visible?: boolean): string {
  if (!visible) return 'A convenir'
  if (!min && !max) return 'A convenir'
  if (min && max) return `${min.toLocaleString('es-ES')}€ – ${max.toLocaleString('es-ES')}€/mes`
  if (min) return `Desde ${min.toLocaleString('es-ES')}€/mes`
  if (max) return `Hasta ${max.toLocaleString('es-ES')}€/mes`
  return 'A convenir'
}
