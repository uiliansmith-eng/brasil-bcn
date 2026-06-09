// Auto-generado desde schema.sql — actualizar con: supabase gen types typescript

export type UserRole = 'user' | 'company' | 'admin'
export type JobType = 'full_time' | 'part_time' | 'freelance' | 'internship' | 'temporary'
export type JobCategory = 'hosteleria' | 'construccion' | 'limpieza' | 'belleza' | 'transporte' | 'comercio' | 'tecnologia' | 'educacion' | 'salud' | 'administracion' | 'otro'
export type CompanyCategory = 'restaurantes' | 'abogados' | 'peluquerias' | 'construccion' | 'contables' | 'tiendas' | 'transporte' | 'educacion' | 'salud' | 'tecnologia' | 'otro'
export type EventCategory = 'fiesta' | 'cultura' | 'deporte' | 'networking' | 'gastronomia' | 'arte' | 'musica' | 'otro'
export type GuideCategory = 'nie' | 'empadronamiento' | 'autonomos' | 'seguridad_social' | 'bancos' | 'vivienda' | 'educacion' | 'sanidad' | 'otro'
export type AdPosition = 'home_hero' | 'sidebar' | 'footer' | 'jobs_top' | 'companies_top'
export type ListingCategory = 'electronica' | 'muebles' | 'ropa' | 'vehiculos' | 'libros' | 'deportes' | 'hogar' | 'bebes' | 'otro'
export type ListingCondition = 'nuevo' | 'como_nuevo' | 'buen_estado' | 'aceptable'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  phone: string | null
  whatsapp: string | null
  bio: string | null
  city: string | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  category: CompanyCategory
  logo_url: string | null
  cover_url: string | null
  website: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  city: string
  latitude: number | null
  longitude: number | null
  gallery: string[]
  is_verified: boolean
  is_active: boolean
  is_approved: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  posted_by: string
  company_id: string | null
  title: string
  description: string
  category: JobCategory
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  salary_visible: boolean
  location: string | null
  city: string
  whatsapp: string | null
  email: string | null
  requirements: string | null
  benefits: string | null
  is_active: boolean
  is_approved: boolean
  is_urgent: boolean
  views: number
  applications: number
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  organizer_id: string
  title: string
  slug: string
  description: string
  category: EventCategory
  image_url: string | null
  location: string | null
  address: string | null
  city: string
  date_start: string
  date_end: string | null
  price: number | null
  price_visible: boolean
  capacity: number | null
  attendees: number
  whatsapp: string | null
  url: string | null
  is_active: boolean
  is_approved: boolean
  is_free: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Guide {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: GuideCategory
  cover_url: string | null
  reading_time: number
  is_published: boolean
  published_at: string | null
  views: number
  created_at: string
  updated_at: string
}

export interface Advertisement {
  id: string
  advertiser_id: string | null
  title: string
  description: string | null
  image_url: string
  url: string
  position: AdPosition
  starts_at: string
  ends_at: string
  is_active: boolean
  clicks: number
  impressions: number
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  seller_id: string | null
  title: string
  description: string
  price: number | null
  price_negotiable: boolean
  category: ListingCategory
  condition: ListingCondition
  images: string[]
  city: string
  whatsapp: string | null
  is_active: boolean
  is_approved: boolean
  is_sold: boolean
  views: number
  created_at: string
  updated_at: string
}

// Joined types
export interface JobWithCompany extends Job {
  company: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'> | null
  poster: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface CompanyWithOwner extends Company {
  owner: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface EventWithOrganizer extends Event {
  organizer: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface ListingWithSeller extends Listing {
  seller: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'whatsapp'> | null
}

// Database type for Supabase client typing
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'id'>> }
      companies: { Row: Company; Insert: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'views'>; Update: Partial<Omit<Company, 'id' | 'created_at'>> }
      jobs: { Row: Job; Insert: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'views' | 'applications'>; Update: Partial<Omit<Job, 'id' | 'created_at'>> }
      events: { Row: Event; Insert: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'views' | 'attendees' | 'is_free'>; Update: Partial<Omit<Event, 'id' | 'created_at'>> }
      guides: { Row: Guide; Insert: Omit<Guide, 'id' | 'created_at' | 'updated_at' | 'views' | 'published_at'>; Update: Partial<Omit<Guide, 'id' | 'created_at'>> }
      advertisements: { Row: Advertisement; Insert: Omit<Advertisement, 'id' | 'created_at' | 'updated_at' | 'clicks' | 'impressions'>; Update: Partial<Omit<Advertisement, 'id' | 'created_at'>> }
      listings: { Row: Listing; Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'views'>; Update: Partial<Omit<Listing, 'id' | 'created_at'>> }
    }
    Enums: {
      user_role: UserRole
      job_type: JobType
      job_category: JobCategory
      company_category: CompanyCategory
      event_category: EventCategory
      guide_category: GuideCategory
      ad_position: AdPosition
      listing_category: ListingCategory
      listing_condition: ListingCondition
    }
  }
}
