'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { reservationSchema, availabilityDaySchema, type ReservationInput, type AvailabilityDayInput } from '@/lib/validations/reservations'
import { notifyUser } from '@/actions/notifications'
import { checkRateLimit } from '@/lib/rate-limit'
import { RESERVATION_STATUS_LABELS } from '@/lib/constants'
import type { ReservationStatus } from '@/types'

// weekday sigue la convención de Date.getDay(): 0 = domingo … 6 = sábado.

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60).toString().padStart(2, '0')
  const mm = (m % 60).toString().padStart(2, '0')
  return `${h}:${mm}`
}

// ─── PÚBLICO: DISPONIBILIDAD Y HUECOS ───────────────────────────

export async function getStoreAvailability(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_availability')
    .select('*')
    .eq('company_id', companyId)
    .order('weekday', { ascending: true })

  return data ?? []
}

export async function getAvailableSlots(companyId: string, storeItemId: string, date: string): Promise<string[]> {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('store_items')
    .select('duration_min')
    .eq('id', storeItemId)
    .maybeSingle()

  const duration = item?.duration_min ?? 30
  const weekday = new Date(`${date}T00:00:00`).getDay()

  const { data: availability } = await supabase
    .from('store_availability')
    .select('*')
    .eq('company_id', companyId)
    .eq('weekday', weekday)
    .maybeSingle()

  if (!availability || availability.is_closed || !availability.open_time || !availability.close_time) return []

  const { data: existing } = await supabase
    .from('reservations')
    .select('start_time, end_time')
    .eq('company_id', companyId)
    .eq('store_item_id', storeItemId)
    .eq('date', date)
    .neq('status', 'cancelled')

  const busyRanges = (existing ?? []).map((r) => ({
    start: timeToMinutes(r.start_time),
    end: r.end_time ? timeToMinutes(r.end_time) : timeToMinutes(r.start_time) + duration,
  }))

  const openMin = timeToMinutes(availability.open_time)
  const closeMin = timeToMinutes(availability.close_time)

  const slots: string[] = []
  for (let start = openMin; start + duration <= closeMin; start += duration) {
    const end = start + duration
    const overlaps = busyRanges.some((b) => start < b.end && end > b.start)
    if (!overlaps) slots.push(minutesToTime(start))
  }

  return slots
}

// ─── CLIENTE: RESERVAS ───────────────────────────────────────────

export async function createReservationAction(
  companyId: string,
  storeItemId: string,
  data: ReservationInput
): Promise<{ error: string } | { ok: true; reservationId: string }> {
  const parsed = reservationSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para reservar.' }

  const withinLimit = await checkRateLimit('create_reservation', user.id, 10, 600)
  if (!withinLimit) return { error: 'Demasiadas reservas en poco tiempo. Espera unos minutos e inténtalo de nuevo.' }

  const { data: item } = await supabase
    .from('store_items')
    .select('duration_min, is_active, company_id')
    .eq('id', storeItemId)
    .maybeSingle()

  if (!item || item.company_id !== companyId || !item.is_active) {
    return { error: 'Este servicio ya no está disponible.' }
  }

  // Revalida el hueco en el servidor para evitar reservas duplicadas
  // por condiciones de carrera (dos personas reservando a la vez).
  const availableSlots = await getAvailableSlots(companyId, storeItemId, parsed.data.date)
  if (!availableSlots.includes(parsed.data.start_time)) {
    return { error: 'Ese horario ya no está disponible. Elige otro.' }
  }

  const duration = item.duration_min ?? 30
  const endTime = minutesToTime(timeToMinutes(parsed.data.start_time) + duration)

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      company_id: companyId,
      store_item_id: storeItemId,
      customer_id: user.id,
      customer_name: parsed.data.customer_name,
      customer_phone: parsed.data.customer_phone,
      date: parsed.data.date,
      start_time: parsed.data.start_time,
      end_time: endTime,
      notes: parsed.data.notes || null,
    })
    .select('id')
    .single()

  if (error || !reservation) return { error: 'Error al crear la reserva. Inténtalo de nuevo.' }

  const { data: company } = await supabase.from('companies').select('owner_id, name').eq('id', companyId).single()
  if (company) {
    await notifyUser(company.owner_id, 'reservation_received', `Nueva reserva en ${company.name}`, `${parsed.data.date} · ${parsed.data.start_time}`, { reservation_id: reservation.id })
  }

  revalidatePath('/dashboard/reservas')
  return { ok: true, reservationId: reservation.id }
}

export async function getMyReservations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('reservations')
    .select('*, company:companies(name, slug, logo_url, whatsapp), item:store_items(name)')
    .eq('customer_id', user.id)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })

  return data ?? []
}

export async function getReservationById(reservationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservations')
    .select('*, company:companies(name, slug, logo_url, whatsapp), item:store_items(name)')
    .eq('id', reservationId)
    .maybeSingle()

  return data
}

export async function cancelReservationAction(formData: FormData) {
  const reservationId = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('reservations').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', reservationId)
  revalidatePath('/dashboard/reservas')
}

// ─── TIENDA: GESTIÓN DE HORARIOS Y RESERVAS ─────────────────────

export async function setStoreAvailabilityAction(companyId: string, days: AvailabilityDayInput[]): Promise<{ error: string } | { ok: true }> {
  const parsed = days.map((d) => availabilityDaySchema.safeParse(d))
  if (parsed.some((r) => !r.success)) return { error: 'Datos de horario inválidos.' }
  const cleanDays = parsed.map((r) => (r as { success: true; data: AvailabilityDayInput }).data)

  const supabase = await createClient()

  const rows = cleanDays.map((d) => ({
    company_id: companyId,
    weekday: d.weekday,
    is_closed: d.is_closed,
    open_time: d.is_closed ? null : (d.open_time || null),
    close_time: d.is_closed ? null : (d.close_time || null),
  }))

  const { error } = await supabase
    .from('store_availability')
    .upsert(rows, { onConflict: 'company_id,weekday' })

  if (error) return { error: 'Error al guardar el horario. Inténtalo de nuevo.' }

  revalidatePath(`/dashboard/tienda/${companyId}`)
  return { ok: true }
}

export async function getStoreReservations(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservations')
    .select('*, item:store_items(name)')
    .eq('company_id', companyId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  return data ?? []
}

export async function updateReservationStatusAction(formData: FormData) {
  const reservationId = formData.get('id') as string
  const status = formData.get('status') as ReservationStatus
  const supabase = await createClient()

  const { data: reservation } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reservationId)
    .select('customer_id, company_id, company:companies(name)')
    .single()

  if (reservation) {
    const company = reservation.company as unknown as { name: string } | null
    await notifyUser(reservation.customer_id, 'reservation_status_changed', `Tu reserva en ${company?.name ?? 'la tienda'} está ${RESERVATION_STATUS_LABELS[status].toLowerCase()}`, undefined, { reservation_id: reservationId })
    revalidatePath(`/dashboard/tienda/${reservation.company_id}/reservas`)
  }
}
