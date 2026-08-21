'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { checkoutSchema, cartLineSchema, type CheckoutInput, type CartLineInput } from '@/lib/validations/orders'
import { notifyUser } from '@/actions/notifications'
import { checkRateLimit } from '@/lib/rate-limit'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus } from '@/types'

// ─── CLIENTE: CHECKOUT ──────────────────────────────────────────

export async function createOrderAction(
  companyId: string,
  lines: CartLineInput[],
  data: CheckoutInput
): Promise<{ error: string } | { ok: true; orderId: string }> {
  const parsedData = checkoutSchema.safeParse(data)
  if (!parsedData.success) return { error: parsedData.error.issues[0].message }

  const parsedLines = lines.map((l) => cartLineSchema.safeParse(l))
  if (parsedLines.some((r) => !r.success) || parsedLines.length === 0) {
    return { error: 'El carrito está vacío o contiene datos inválidos.' }
  }
  const cleanLines = parsedLines.map((r) => (r as { success: true; data: CartLineInput }).data)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para completar el pedido.' }

  const withinLimit = await checkRateLimit('create_order', user.id, 10, 600)
  if (!withinLimit) return { error: 'Demasiados pedidos en poco tiempo. Espera unos minutos e inténtalo de nuevo.' }

  // Nunca confiar en precios del cliente: se recalculan desde la BD.
  const itemIds = cleanLines.map((l) => l.store_item_id)
  const { data: storeItems } = await supabase
    .from('store_items')
    .select('id, name, price, is_active, track_stock, stock, company_id')
    .in('id', itemIds)

  if (!storeItems || storeItems.length !== itemIds.length) {
    return { error: 'Alguno de los productos ya no está disponible.' }
  }

  for (const item of storeItems) {
    if (item.company_id !== companyId) return { error: 'Pedido inválido.' }
    if (!item.is_active) return { error: `"${item.name}" ya no está disponible.` }
  }

  const byId = new Map(storeItems.map((i) => [i.id, i]))
  let subtotal = 0
  const orderItemsPayload = cleanLines.map((line) => {
    const item = byId.get(line.store_item_id)!
    const price = item.price ?? 0
    const lineSubtotal = price * line.quantity
    subtotal += lineSubtotal
    return {
      store_item_id: item.id,
      name_snapshot: item.name,
      price_snapshot: price,
      quantity: line.quantity,
      subtotal: lineSubtotal,
    }
  })

  for (const line of cleanLines) {
    const item = byId.get(line.store_item_id)!
    if (item.track_stock && (item.stock ?? 0) < line.quantity) {
      return { error: `No hay suficiente stock de "${item.name}".` }
    }
  }

  let discount = 0
  let couponId: string | null = null
  if (parsedData.data.coupon_code) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('id, discount_type, discount_value, is_active, starts_at, ends_at, max_uses, used_count')
      .eq('company_id', companyId)
      .eq('code', parsedData.data.coupon_code.toUpperCase())
      .maybeSingle()

    if (coupon && coupon.is_active
      && (!coupon.starts_at || new Date(coupon.starts_at) <= new Date())
      && (!coupon.ends_at || new Date(coupon.ends_at) >= new Date())
      && (coupon.max_uses === null || coupon.used_count < coupon.max_uses)
    ) {
      couponId = coupon.id
      discount = coupon.discount_type === 'percentage'
        ? subtotal * (coupon.discount_value / 100)
        : Math.min(coupon.discount_value, subtotal)
    }
  }

  const total = Math.max(subtotal - discount, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      company_id: companyId,
      customer_id: user.id,
      subtotal,
      discount,
      total,
      coupon_id: couponId,
      fulfillment_method: parsedData.data.fulfillment_method,
      customer_name: parsedData.data.customer_name,
      customer_phone: parsedData.data.customer_phone,
      customer_notes: parsedData.data.customer_notes || null,
    })
    .select('id')
    .single()

  if (orderError || !order) return { error: 'Error al crear el pedido. Inténtalo de nuevo.' }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload.map((item) => ({ ...item, order_id: order.id })))

  if (itemsError) return { error: 'Error al guardar los productos del pedido.' }

  for (const line of cleanLines) {
    const item = byId.get(line.store_item_id)!
    if (item.track_stock) {
      await supabase
        .from('store_items')
        .update({ stock: Math.max((item.stock ?? 0) - line.quantity, 0) })
        .eq('id', item.id)
    }
  }

  if (couponId) {
    await supabase.from('coupon_redemptions').insert({ coupon_id: couponId, user_id: user.id, order_id: order.id })
    const { data: current } = await supabase.from('coupons').select('used_count').eq('id', couponId).single()
    await supabase.from('coupons').update({ used_count: (current?.used_count ?? 0) + 1 }).eq('id', couponId)
  }

  const { data: company } = await supabase.from('companies').select('owner_id, name').eq('id', companyId).single()
  if (company) {
    await notifyUser(company.owner_id, 'order_received', `Nuevo pedido en ${company.name}`, `${orderItemsPayload.length} producto(s) · ${total.toLocaleString('es-ES')}€`, { order_id: order.id })
  }

  revalidatePath('/dashboard/pedidos')
  return { ok: true, orderId: order.id }
}

export async function getMyOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('orders')
    .select('*, company:companies(name, slug, logo_url), items:order_items(*)')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, company:companies(name, slug, logo_url, whatsapp), items:order_items(*)')
    .eq('id', orderId)
    .maybeSingle()

  return data
}

// ─── TIENDA: GESTIÓN DE PEDIDOS ─────────────────────────────────

export async function getStoreOrders(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get('id') as string
  const status = formData.get('status') as OrderStatus
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select('customer_id, company_id, company:companies(name)')
    .single()

  if (order) {
    const company = order.company as unknown as { name: string } | null
    await notifyUser(order.customer_id, 'order_status_changed', `Tu pedido en ${company?.name ?? 'la tienda'} está ${ORDER_STATUS_LABELS[status].toLowerCase()}`, undefined, { order_id: orderId })
    revalidatePath(`/dashboard/tienda/${order.company_id}/pedidos`)
  }
}
