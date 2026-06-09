import { z } from 'zod'

export const createAdSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  description: z.string().max(200).optional(),
  image_url: z.string().url('URL de imagen inválida'),
  url: z.string().url('URL de destino inválida'),
  position: z.enum(['home_hero', 'sidebar', 'footer', 'jobs_top', 'companies_top'], {
    message: 'Selecciona una posición',
  }),
  starts_at: z.string().min(1, 'Fecha de inicio requerida'),
  ends_at: z.string().min(1, 'Fecha de fin requerida'),
})

export type CreateAdInput = z.infer<typeof createAdSchema>
