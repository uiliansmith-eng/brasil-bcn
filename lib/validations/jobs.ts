import { z } from 'zod'

export const createJobSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(50, 'Describe bien el puesto — mínimo 50 caracteres').max(5000),
  category: z.enum([
    'hosteleria', 'construccion', 'limpieza', 'belleza', 'transporte',
    'comercio', 'tecnologia', 'educacion', 'salud', 'administracion', 'otro',
  ], { message: 'Selecciona una categoría' }),
  job_type: z.enum(['full_time', 'part_time', 'freelance', 'internship', 'temporary'], {
    message: 'Selecciona el tipo de jornada',
  }),
  salary_min: z.coerce.number().min(0).optional().nullable(),
  salary_max: z.coerce.number().min(0).optional().nullable(),
  salary_visible: z.boolean().default(true),
  location: z.string().max(100).optional(),
  city: z.string().default('Barcelona'),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  requirements: z.string().max(2000).optional(),
  benefits: z.string().max(1000).optional(),
  is_urgent: z.boolean(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
