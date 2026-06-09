import { z } from 'zod'

export const createGuideSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(100, 'El contenido debe tener al menos 100 caracteres'),
  category: z.enum(
    ['nie', 'empadronamiento', 'autonomos', 'seguridad_social', 'bancos', 'vivienda', 'educacion', 'sanidad', 'otro'],
    { message: 'Selecciona una categoría' }
  ),
  cover_url: z.string().url('URL inválida').optional().or(z.literal('')),
  is_published: z.boolean(),
})

export type CreateGuideInput = z.infer<typeof createGuideSchema>
