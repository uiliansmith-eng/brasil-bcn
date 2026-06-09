import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(150),
  description: z.string().min(30, 'Describe el evento — mínimo 30 caracteres').max(5000),
  category: z.enum(
    ['fiesta', 'cultura', 'deporte', 'networking', 'gastronomia', 'arte', 'musica', 'otro'],
    { message: 'Selecciona una categoría' }
  ),
  location: z.string().min(2, 'Añade el nombre del lugar').max(200),
  address: z.string().max(200).optional(),
  city: z.string().default('Barcelona'),
  date_start: z.string().min(1, 'La fecha de inicio es requerida'),
  date_end: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  price_visible: z.boolean(),
  capacity: z.coerce.number().min(1).optional(),
  whatsapp: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
