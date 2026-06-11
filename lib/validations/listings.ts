import { z } from 'zod'

export const LISTING_CATEGORIES = ['electronica', 'muebles', 'ropa', 'vehiculos', 'libros', 'deportes', 'hogar', 'bebes', 'otro'] as const
export const LISTING_CONDITIONS = ['nuevo', 'como_nuevo', 'buen_estado', 'aceptable'] as const

export const createListingSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres').max(2000, 'Máximo 2000 caracteres'),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().positive('El precio debe ser mayor que 0').optional()
  ),
  price_negotiable: z.boolean(),
  category: z.enum(LISTING_CATEGORIES, { error: 'Selecciona una categoría' }),
  condition: z.enum(LISTING_CONDITIONS, { error: 'Selecciona el estado del artículo' }),
  city: z.string().min(1, 'Selecciona una ciudad'),
  whatsapp: z.string().optional(),
  images: z.array(z.string().url()).max(5).optional(),
})

export type CreateListingInput = z.infer<typeof createListingSchema>
