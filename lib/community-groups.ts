export interface CommunityGroup {
  id: string
  name: string
  description: string
  category: string
  categoryLabel: string
  emoji: string
  members: number
  url: string
}

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'general',
    name: 'BrasilBCN — General',
    description: 'El grupo principal de la comunidad. Noticias, dudas, consejos y encuentros entre brasileños en Barcelona.',
    category: 'general',
    categoryLabel: 'General',
    emoji: '🇧🇷',
    members: 1240,
    url: 'https://chat.whatsapp.com/brasilbcn-general',
  },
  {
    id: 'empleos',
    name: 'Empleos Barcelona',
    description: 'Ofertas de trabajo, candidatos disponibles y oportunidades laborales para brasileños en Cataluña.',
    category: 'empleo',
    categoryLabel: 'Empleo',
    emoji: '💼',
    members: 876,
    url: 'https://chat.whatsapp.com/brasilbcn-empleos',
  },
  {
    id: 'vivienda',
    name: 'Vivienda & Alquiler',
    description: 'Pisos en alquiler, compañeros de piso y consejos para encontrar vivienda en Barcelona.',
    category: 'vivienda',
    categoryLabel: 'Vivienda',
    emoji: '🏠',
    members: 654,
    url: 'https://chat.whatsapp.com/brasilbcn-vivienda',
  },
  {
    id: 'compraventa',
    name: 'Compra y Venta',
    description: 'Vende o compra artículos de segunda mano entre la comunidad. Electrónica, muebles, ropa y más.',
    category: 'compraventa',
    categoryLabel: 'Compra & Venta',
    emoji: '🛒',
    members: 932,
    url: 'https://chat.whatsapp.com/brasilbcn-compraventa',
  },
  {
    id: 'maes',
    name: 'Mães e Bebês BCN',
    description: 'Grupo para madres brasileñas en Barcelona. Guarderías, colegios, pediatras y apoyo mutuo.',
    category: 'familia',
    categoryLabel: 'Familia',
    emoji: '👶',
    members: 423,
    url: 'https://chat.whatsapp.com/brasilbcn-maes',
  },
  {
    id: 'esportes',
    name: 'Esportes & Futebol',
    description: 'Peladas, equipos amateur y seguimiento de la Seleção. ¡Vem jogar!',
    category: 'esportes',
    categoryLabel: 'Deportes',
    emoji: '⚽',
    members: 389,
    url: 'https://chat.whatsapp.com/brasilbcn-esportes',
  },
  {
    id: 'estudantes',
    name: 'Estudantes Barcelona',
    description: 'Para estudiantes brasileños en universidades y escuelas de idiomas en Barcelona.',
    category: 'educacion',
    categoryLabel: 'Educación',
    emoji: '📚',
    members: 311,
    url: 'https://chat.whatsapp.com/brasilbcn-estudantes',
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia Brasileira',
    description: 'Recetas, restaurantes, productos brasileños y dónde encontrar ingredientes típicos en Barcelona.',
    category: 'gastronomia',
    categoryLabel: 'Gastronomía',
    emoji: '🍽️',
    members: 567,
    url: 'https://chat.whatsapp.com/brasilbcn-gastronomia',
  },
]

export const GROUP_CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-[#002776]/10 text-[#002776]',
  empleo: 'bg-green-50 text-green-700',
  vivienda: 'bg-teal-50 text-teal-700',
  compraventa: 'bg-orange-50 text-orange-700',
  familia: 'bg-pink-50 text-pink-700',
  esportes: 'bg-yellow-50 text-yellow-700',
  educacion: 'bg-purple-50 text-purple-700',
  gastronomia: 'bg-red-50 text-red-700',
}
