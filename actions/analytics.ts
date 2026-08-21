'use server'

import { createClient } from '@/lib/supabase/server'

export async function trackStoreEventAction(companyId: string, eventType: string, sessionId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('store_analytics_events').insert({
    company_id: companyId,
    event_type: eventType,
    session_id: sessionId ?? null,
    user_id: user?.id ?? null,
  })
}

// ─── TIENDA: RESUMEN DE ANALÍTICA ───────────────────────────────

export interface StoreAnalyticsSummary {
  views: number
  whatsappClicks: number
  qrClaims: number
  favorites: number
  orders: number
  revenue: number
  reservations: number
  reviewsCount: number
  avgRating: number
}

const PERIOD_DAYS = 30

export async function getStoreAnalyticsSummary(companyId: string): Promise<StoreAnalyticsSummary> {
  const supabase = await createClient()
  const since = new Date(Date.now() - PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const [events, favoritesCount, orders, reservationsCount, reviews] = await Promise.all([
    supabase.from('store_analytics_events').select('event_type').eq('company_id', companyId).gte('created_at', since),
    supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('orders').select('total').eq('company_id', companyId).gte('created_at', since),
    supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('company_id', companyId).gte('created_at', since),
    supabase.from('reviews').select('rating').eq('company_id', companyId).eq('is_hidden', false),
  ])

  const eventCounts: Record<string, number> = {}
  for (const row of events.data ?? []) {
    eventCounts[row.event_type] = (eventCounts[row.event_type] ?? 0) + 1
  }

  const ratings = reviews.data ?? []
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0

  return {
    views: eventCounts['store_viewed'] ?? 0,
    whatsappClicks: eventCounts['whatsapp_click'] ?? 0,
    qrClaims: eventCounts['coupon_qr_claimed'] ?? 0,
    favorites: favoritesCount.count ?? 0,
    orders: orders.data?.length ?? 0,
    revenue: (orders.data ?? []).reduce((s, o) => s + o.total, 0),
    reservations: reservationsCount.count ?? 0,
    reviewsCount: ratings.length,
    avgRating,
  }
}

// ─── ADMIN: RESUMEN DE PLATAFORMA ───────────────────────────────

export interface PlatformAnalyticsSummary {
  totalStores: number
  publishedStores: number
  totalOrders: number
  totalRevenue: number
  totalReservations: number
  totalQrClaims: number
  totalReviews: number
}

export async function getPlatformAnalyticsSummary(): Promise<PlatformAnalyticsSummary | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) return null

  const since = new Date(Date.now() - PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const [totalStores, publishedStores, orders, reservations, qrClaims, reviews] = await Promise.all([
    supabase.from('companies').select('id', { count: 'exact', head: true }).eq('is_store', true),
    supabase.from('companies').select('id', { count: 'exact', head: true }).eq('is_store', true).eq('status', 'published'),
    supabase.from('orders').select('total').gte('created_at', since),
    supabase.from('reservations').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('status', 'used').gte('used_at', since),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_hidden', false),
  ])

  return {
    totalStores: totalStores.count ?? 0,
    publishedStores: publishedStores.count ?? 0,
    totalOrders: orders.data?.length ?? 0,
    totalRevenue: (orders.data ?? []).reduce((s, o) => s + o.total, 0),
    totalReservations: reservations.count ?? 0,
    totalQrClaims: qrClaims.count ?? 0,
    totalReviews: reviews.count ?? 0,
  }
}
