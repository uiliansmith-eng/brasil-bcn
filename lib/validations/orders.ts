import { z } from 'zod'

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  customer_phone: z.string().min(6, 'Teléfono inválido').max(30),
  customer_notes: z.string().max(500).optional().or(z.literal('')),
  fulfillment_method: z.enum(['pickup', 'delivery']),
  coupon_code: z.string().max(30).optional().or(z.literal('')),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const cartLineSchema = z.object({
  store_item_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})

export type CartLineInput = z.infer<typeof cartLineSchema>
