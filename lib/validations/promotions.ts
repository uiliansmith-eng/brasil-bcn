import { z } from 'zod'

export const promotionSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  link_url: z.string().url('URL inválida').optional().or(z.literal('')),
  starts_at: z.string().optional().or(z.literal('')),
  ends_at: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

export type PromotionInput = z.infer<typeof promotionSchema>

export const homeBannerSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  image_url: z.string().url('URL de imagen inválida'),
  link_url: z.string().url('URL de destino inválida'),
  starts_at: z.string().optional().or(z.literal('')),
  ends_at: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

export type HomeBannerInput = z.infer<typeof homeBannerSchema>
