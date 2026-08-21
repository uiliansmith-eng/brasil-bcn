import { z } from 'zod'
import { createCompanySchema } from './companies'

export const activateStoreSchema = z.object({
  instagram: z.string().max(100).optional().or(z.literal('')),
  business_hours: z.string().max(300).optional().or(z.literal('')),
  language: z.enum(['pt', 'es', 'en']).default('pt'),
  extra_info: z.string().max(1000).optional().or(z.literal('')),
})

export type ActivateStoreInput = z.infer<typeof activateStoreSchema>

// Formulario completo de "Crear mi tienda" cuando el usuario todavía
// no tiene ninguna empresa registrada: datos base de empresa + tienda.
export const createStoreSchema = createCompanySchema.merge(activateStoreSchema)

export type CreateStoreInput = z.infer<typeof createStoreSchema>

export const storeItemSchema = z.object({
  item_type: z.enum(['product', 'service']),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  description: z.string().max(1000).optional().or(z.literal('')),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  price: z.coerce.number().min(0).optional().nullable(),
  category: z.string().max(60).optional().or(z.literal('')),
  duration_min: z.coerce.number().int().min(0).optional().nullable(),
  is_active: z.boolean().default(true),
})

export type StoreItemInput = z.infer<typeof storeItemSchema>

export const couponSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  code: z.string().min(2, 'Mínimo 2 caracteres').max(30)
    .regex(/^[A-Za-z0-9_-]+$/, 'Solo letras, números, guiones')
    .transform((v) => v.toUpperCase()),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().positive('Debe ser mayor a 0'),
  starts_at: z.string().optional().or(z.literal('')),
  ends_at: z.string().optional().or(z.literal('')),
  max_uses: z.coerce.number().int().min(1).optional().nullable(),
  is_active: z.boolean().default(true),
})

export type CouponInput = z.infer<typeof couponSchema>
