import type { JobCategory, JobType, CompanyCategory, EventCategory, GuideCategory, ListingCategory, ListingCondition, StoreItemType, StoreModuleKey, CompanyStatus, OrderStatus, FulfillmentMethod, ReservationStatus } from '@/types'

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Jornada completa',
  part_time: 'Media jornada',
  freelance: 'Freelance',
  internship: 'Prácticas',
  temporary: 'Temporal',
}

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  administracion: 'Administración',
  belleza: 'Belleza',
  comercio: 'Comercio',
  construccion: 'Construcción',
  educacion: 'Educación',
  hosteleria: 'Hostelería',
  limpieza: 'Limpieza',
  salud: 'Salud',
  tecnologia: 'Tecnología',
  transporte: 'Transporte',
  otro: 'Otro',
}

export const COMPANY_CATEGORY_LABELS: Record<CompanyCategory, string> = {
  restaurantes: 'Restaurantes',
  bar_cafeteria: 'Bar / Cafetería',
  abogados: 'Abogados',
  peluquerias: 'Peluquería / Estética',
  barberia: 'Barbería',
  construccion: 'Construcción',
  contables: 'Contables',
  tiendas: 'Tienda de productos',
  servicios_profesionales: 'Servicios profesionales',
  transporte: 'Transporte',
  educacion: 'Educación',
  salud: 'Salud',
  tecnologia: 'Tecnología',
  otro: 'Otro',
}

// ─── TIENDAS ────────────────────────────────────────────────────

export const STORE_ITEM_TYPE_LABELS: Record<StoreItemType, string> = {
  product: 'Producto',
  service: 'Servicio',
}

// Categorías cuyo catálogo se presenta por defecto como "servicios"
// (con duración) en vez de "productos". El propietario puede mezclar
// ambos tipos igualmente — esto solo afecta la etiqueta/CTA por defecto.
export const STORE_SERVICE_FIRST_CATEGORIES: CompanyCategory[] = [
  'peluquerias', 'barberia', 'servicios_profesionales',
]

export const STORE_MODULE_LABELS: Record<StoreModuleKey, string> = {
  products: 'Productos',
  services: 'Servicios',
  bookings: 'Reservas',
  payments: 'Pagos online',
  coupons: 'Cupones',
  qr: 'Cupones QR',
  gallery: 'Galería',
  reviews: 'Reseñas',
  promotions: 'Promociones',
  delivery: 'Entrega a domicilio',
  pickup: 'Recogida en tienda',
}

// Módulos activados por defecto al crear una tienda; el resto queda
// construido en la base de datos pero desactivado hasta que el
// propietario (o un admin) lo active desde el panel.
export const STORE_MODULE_DEFAULTS: Record<StoreModuleKey, boolean> = {
  products: true,
  services: true,
  bookings: false,
  payments: false,
  coupons: true,
  qr: false,
  gallery: true,
  reviews: true,
  promotions: false,
  delivery: false,
  pickup: false,
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  draft: 'Borrador',
  published: 'Publicada',
  paused: 'Pausada',
  suspended: 'Suspendida',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  preparing: 'Preparando',
  ready: 'Listo',
  completed: 'Completado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

export const FULFILLMENT_METHOD_LABELS: Record<FulfillmentMethod, string> = {
  pickup: 'Recoger en tienda',
  delivery: 'Entrega a domicilio',
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
}

export const STORE_CATALOG_LABEL: Record<CompanyCategory, string> = {
  restaurantes: 'Menú',
  bar_cafeteria: 'Menú',
  abogados: 'Servicios',
  peluquerias: 'Servicios',
  barberia: 'Servicios',
  construccion: 'Servicios',
  contables: 'Servicios',
  tiendas: 'Catálogo',
  servicios_profesionales: 'Servicios',
  transporte: 'Servicios',
  educacion: 'Servicios',
  salud: 'Servicios',
  tecnologia: 'Servicios',
  otro: 'Catálogo',
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
  ciudadania: 'Elecciones y Ciudadanía',
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
  ciudadania: '🗳️',
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
  ciudadania: 'bg-indigo-50 text-indigo-700',
  otro: 'bg-gray-50 text-gray-600',
}

export const JOB_CATEGORY_EMOJI: Record<JobCategory, string> = {
  administracion: '📋',
  belleza: '✂️',
  comercio: '🛍️',
  construccion: '🏗️',
  educacion: '📚',
  hosteleria: '🍽️',
  limpieza: '🧹',
  salud: '🏥',
  tecnologia: '💻',
  transporte: '🚗',
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

export const CITIES_BY_PROVINCE: { region: string; cities: string[] }[] = [
  { region: 'Cataluña', cities: ['Barcelona', 'Badalona', "L'Hospitalet", 'Terrassa', 'Sabadell', 'Mataró', 'Girona', 'Tarragona', 'Lleida', 'Reus', 'Manresa', 'Castelldefels', 'Gavà', 'Viladecans', 'Cornellà', 'Sant Boi', 'Granollers', 'Vic', 'Figueres'] },
  { region: 'Comunidad de Madrid', cities: ['Madrid', 'Alcalá de Henares', 'Alcorcón', 'Fuenlabrada', 'Getafe', 'Leganés', 'Móstoles', 'Torrejón de Ardoz', 'Alcobendas', 'Las Rozas', 'Pozuelo'] },
  { region: 'Comunidad Valenciana', cities: ['Valencia', 'Alicante', 'Castellón', 'Elche', 'Torrevieja', 'Benidorm', 'Gandía'] },
  { region: 'Andalucía', cities: ['Sevilla', 'Málaga', 'Granada', 'Córdoba', 'Cádiz', 'Almería', 'Huelva', 'Jaén', 'Marbella', 'Jerez de la Frontera', 'Torremolinos', 'Fuengirola'] },
  { region: 'País Vasco', cities: ['Bilbao', 'San Sebastián', 'Vitoria'] },
  { region: 'Galicia', cities: ['A Coruña', 'Vigo', 'Santiago de Compostela', 'Pontevedra'] },
  { region: 'Aragón', cities: ['Zaragoza', 'Huesca', 'Teruel'] },
  { region: 'Castilla y León', cities: ['Valladolid', 'Burgos', 'Salamanca', 'León', 'Palencia', 'Ávila', 'Segovia', 'Soria', 'Zamora'] },
  { region: 'Castilla-La Mancha', cities: ['Toledo', 'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara'] },
  { region: 'Región de Murcia', cities: ['Murcia', 'Cartagena'] },
  { region: 'Canarias', cities: ['Las Palmas', 'Santa Cruz de Tenerife', 'Tenerife', 'Gran Canaria', 'Lanzarote', 'Fuerteventura'] },
  { region: 'Islas Baleares', cities: ['Palma', 'Ibiza', 'Menorca'] },
  { region: 'Navarra', cities: ['Pamplona'] },
  { region: 'La Rioja', cities: ['Logroño'] },
  { region: 'Asturias', cities: ['Oviedo', 'Gijón'] },
  { region: 'Cantabria', cities: ['Santander'] },
  { region: 'Extremadura', cities: ['Badajoz', 'Cáceres'] },
]

export const CITIES = CITIES_BY_PROVINCE.flatMap((p) => p.cities)

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
