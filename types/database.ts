// Auto-generado desde schema.sql — actualizar con: supabase gen types typescript

export type UserRole = 'user' | 'company' | 'admin' | 'super_admin' | 'employee'
export type JobType = 'full_time' | 'part_time' | 'freelance' | 'internship' | 'temporary'
export type JobCategory = 'hosteleria' | 'construccion' | 'limpieza' | 'belleza' | 'transporte' | 'comercio' | 'tecnologia' | 'educacion' | 'salud' | 'administracion' | 'otro'
export type CompanyCategory = 'restaurantes' | 'abogados' | 'peluquerias' | 'construccion' | 'contables' | 'tiendas' | 'transporte' | 'educacion' | 'salud' | 'tecnologia' | 'bar_cafeteria' | 'barberia' | 'servicios_profesionales' | 'otro'
export type StoreItemType = 'product' | 'service'
export type StorePlan = 'free' | 'business' | 'premium'
export type CouponDiscountType = 'percentage' | 'fixed'
export type CompanyStatus = 'draft' | 'published' | 'paused' | 'suspended'
export type StoreModuleKey = 'products' | 'services' | 'bookings' | 'payments' | 'coupons' | 'qr' | 'gallery' | 'reviews' | 'promotions' | 'delivery' | 'pickup'
export type StoreEmployeeRole = 'employee' | 'manager'
export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'refunded'
export type OrderPaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'
export type FulfillmentMethod = 'pickup' | 'delivery'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type QrCodeStatus = 'issued' | 'used'
export type PromotionScope = 'store' | 'product' | 'category' | 'home_banner'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing'
export type BillingPeriod = 'monthly' | 'yearly'
export type EventCategory = 'fiesta' | 'cultura' | 'deporte' | 'networking' | 'gastronomia' | 'arte' | 'musica' | 'otro'
export type GuideCategory = 'nie' | 'empadronamiento' | 'autonomos' | 'seguridad_social' | 'bancos' | 'vivienda' | 'educacion' | 'sanidad' | 'ciudadania' | 'otro'
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
  instagram: string | null
  business_hours: Record<string, string> | null
  language: string
  extra_info: string | null
  is_store: boolean
  store_plan: StorePlan
  store_category_id: string | null
  store_subcategory_id: string | null
  status: CompanyStatus
  created_at: string
  updated_at: string
}

export interface StoreCategory {
  id: string
  key: string
  label: string
  icon: string | null
  legacy_company_category: CompanyCategory
  display_order: number
}

export interface StoreSubcategory {
  id: string
  category_id: string
  key: string
  label: string
  display_order: number
}

export interface StoreModule {
  id: string
  company_id: string
  module_key: StoreModuleKey
  is_active: boolean
  created_at: string
}

export interface StoreEmployee {
  id: string
  company_id: string
  user_id: string
  role: StoreEmployeeRole
  created_at: string
}

export interface Order {
  id: string
  company_id: string
  customer_id: string
  status: OrderStatus
  payment_status: OrderPaymentStatus
  fulfillment_method: FulfillmentMethod
  subtotal: number
  discount: number
  total: number
  coupon_id: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  store_item_id: string | null
  name_snapshot: string
  price_snapshot: number
  quantity: number
  subtotal: number
}

export interface Payment {
  id: string
  company_id: string
  order_id: string | null
  reservation_id: string | null
  provider: string
  provider_payment_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  idempotency_key: string | null
  created_at: string
}

export interface Reservation {
  id: string
  company_id: string
  store_item_id: string | null
  customer_id: string
  customer_name: string | null
  customer_phone: string | null
  date: string
  start_time: string
  end_time: string | null
  status: ReservationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StoreAvailability {
  id: string
  company_id: string
  weekday: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface QrCode {
  id: string
  coupon_id: string
  code: string
  user_id: string | null
  status: QrCodeStatus
  issued_at: string
  used_at: string | null
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  user_id: string | null
  order_id: string | null
  qr_code_id: string | null
  redeemed_at: string
}

export interface Review {
  id: string
  company_id: string
  user_id: string
  rating: number
  comment: string | null
  reply: string | null
  is_hidden: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  company_id: string | null
  store_item_id: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  is_read: boolean
  meta: Record<string, unknown> | null
  created_at: string
}

export interface Promotion {
  id: string
  scope: PromotionScope
  company_id: string | null
  store_item_id: string | null
  title: string
  image_url: string | null
  link_url: string | null
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  key: string
  name: string
  price: number
  currency: string
  billing_period: BillingPeriod
  features: Record<string, unknown> | null
  is_active: boolean
}

export interface Subscription {
  id: string
  company_id: string
  plan_id: string
  status: SubscriptionStatus
  current_period_end: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface StoreAnalyticsEvent {
  id: number
  company_id: string | null
  event_type: string
  session_id: string | null
  user_id: string | null
  meta: Record<string, unknown> | null
  created_at: string
}

export interface AuditLog {
  id: number
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  meta: Record<string, unknown> | null
  created_at: string
}

export interface StoreItem {
  id: string
  company_id: string
  item_type: StoreItemType
  name: string
  description: string | null
  image_url: string | null
  price: number | null
  category: string | null
  duration_min: number | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  company_id: string
  title: string
  code: string
  discount_type: CouponDiscountType
  discount_value: number
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  created_at: string
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

export type QuizStatus = 'draft' | 'published'

export interface Quiz {
  id: string
  title: string
  slug: string
  description: string | null
  status: QuizStatus
  is_quiz_of_week: boolean
  cover_image: string | null
  estimated_minutes: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface QuizResult {
  id: string
  quiz_id: string
  title: string
  slug: string
  icon: string | null
  subtitle: string | null
  description: string | null
  ideal_role: string | null
  order_index: number
  created_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  order_index: number
  created_at: string
}

export interface QuizAnswer {
  id: string
  question_id: string
  answer: string
  result_id: string
  order_index: number
  created_at: string
}

export type QuizEventType =
  | 'quiz_viewed' | 'quiz_started' | 'question_answered' | 'quiz_completed'
  | 'result_viewed' | 'share_clicked' | 'instagram_share_clicked'
  | 'whatsapp_share_clicked' | 'share_image_downloaded'

export interface QuizEvent {
  id: number
  quiz_id: string | null
  session_id: string
  event_type: QuizEventType
  result_id: string | null
  question_id: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  meta: Record<string, unknown> | null
  created_at: string
}

// Joined types
export interface QuestionWithAnswers extends QuizQuestion {
  answers: QuizAnswer[]
}

export interface QuizWithContent extends Quiz {
  questions: QuestionWithAnswers[]
  results: QuizResult[]
}

export interface JobWithCompany extends Job {
  company: Pick<Company, 'id' | 'name' | 'slug' | 'logo_url' | 'category'> | null
  poster: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface CompanyWithOwner extends Company {
  owner: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface StoreWithItems extends Company {
  items: StoreItem[]
  coupons: Coupon[]
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
      store_items: { Row: StoreItem; Insert: Omit<StoreItem, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<StoreItem, 'id' | 'created_at'>> }
      coupons: { Row: Coupon; Insert: Omit<Coupon, 'id' | 'created_at' | 'used_count'>; Update: Partial<Omit<Coupon, 'id' | 'created_at'>> }
      store_categories: { Row: StoreCategory; Insert: Omit<StoreCategory, 'id'>; Update: Partial<Omit<StoreCategory, 'id'>> }
      store_subcategories: { Row: StoreSubcategory; Insert: Omit<StoreSubcategory, 'id'>; Update: Partial<Omit<StoreSubcategory, 'id'>> }
      store_modules: { Row: StoreModule; Insert: Omit<StoreModule, 'id' | 'created_at'>; Update: Partial<Omit<StoreModule, 'id' | 'created_at'>> }
      store_employees: { Row: StoreEmployee; Insert: Omit<StoreEmployee, 'id' | 'created_at'>; Update: Partial<Omit<StoreEmployee, 'id' | 'created_at'>> }
      orders: { Row: Order; Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Order, 'id' | 'created_at'>> }
      order_items: { Row: OrderItem; Insert: Omit<OrderItem, 'id'>; Update: Partial<Omit<OrderItem, 'id'>> }
      payments: { Row: Payment; Insert: Omit<Payment, 'id' | 'created_at'>; Update: Partial<Omit<Payment, 'id' | 'created_at'>> }
      reservations: { Row: Reservation; Insert: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Reservation, 'id' | 'created_at'>> }
      store_availability: { Row: StoreAvailability; Insert: Omit<StoreAvailability, 'id'>; Update: Partial<Omit<StoreAvailability, 'id'>> }
      qr_codes: { Row: QrCode; Insert: Omit<QrCode, 'id' | 'issued_at'>; Update: Partial<Omit<QrCode, 'id'>> }
      coupon_redemptions: { Row: CouponRedemption; Insert: Omit<CouponRedemption, 'id' | 'redeemed_at'>; Update: Partial<Omit<CouponRedemption, 'id'>> }
      reviews: { Row: Review; Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Review, 'id' | 'created_at'>> }
      favorites: { Row: Favorite; Insert: Omit<Favorite, 'id' | 'created_at'>; Update: Partial<Omit<Favorite, 'id'>> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Omit<Notification, 'id'>> }
      promotions: { Row: Promotion; Insert: Omit<Promotion, 'id' | 'created_at'>; Update: Partial<Omit<Promotion, 'id'>> }
      subscription_plans: { Row: SubscriptionPlan; Insert: Omit<SubscriptionPlan, 'id'>; Update: Partial<Omit<SubscriptionPlan, 'id'>> }
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Subscription, 'id' | 'created_at'>> }
      store_analytics_events: { Row: StoreAnalyticsEvent; Insert: Omit<StoreAnalyticsEvent, 'id' | 'created_at'>; Update: Partial<Omit<StoreAnalyticsEvent, 'id'>> }
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, 'id' | 'created_at'>; Update: Partial<Omit<AuditLog, 'id'>> }
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
