export type SiteSettings = {
  maintenance_mode: boolean
  hero: {
    badge_text: string
    subtitle: string
    cta1_text: string
    cta1_href: string
    cta2_text: string
    cta2_href: string
    cta3_text: string
    cta3_href: string
    footnote: string
  }
  launch: {
    title: string
    description: string
    cta_text: string
    cta_href: string
  }
  brand: {
    primary: string
    secondary: string
    accent: string
  }
  sections: {
    election_banner: boolean
    launch_section: boolean
    stats: boolean
    ad_slot: boolean
    jobs: boolean
    companies: boolean
    news: boolean
    cta: boolean
  }
}

export const DEFAULT_SETTINGS: SiteSettings = {
  maintenance_mode: false,
  hero: {
    badge_text: 'Comunidade brasileira em Barcelona',
    subtitle: 'Conectando brasileños en Barcelona. Empleos, empresas, eventos y comunidad para vivir mejor en Cataluña.',
    cta1_text: 'Buscar empleo',
    cta1_href: '/empleos',
    cta2_text: 'Empresas',
    cta2_href: '/empresas',
    cta3_text: 'Eventos',
    cta3_href: '/eventos',
    footnote: '✓ Acceso gratuito · Sin compromiso · Comunidade en crecimiento',
  },
  launch: {
    title: 'Brasil BCN está comenzando 🇧🇷',
    description: 'Somos la plataforma más nueva de la comunidad. Publica tu empresa o tu oferta de trabajo de forma totalmente gratuita y crece con nosotros desde el inicio.',
    cta_text: 'Únete gratis',
    cta_href: '/auth/register',
  },
  brand: {
    primary: '#002776',
    secondary: '#009C3B',
    accent: '#FFDF00',
  },
  sections: {
    election_banner: true,
    launch_section: true,
    stats: true,
    ad_slot: true,
    jobs: true,
    companies: true,
    news: true,
    cta: true,
  },
}
