import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  description: z.string().min(20, 'Describe tu empresa — mínimo 20 caracteres').max(2000),
  category: z.enum([
    'restaurantes', 'abogados', 'peluquerias', 'construccion', 'contables',
    'tiendas', 'transporte', 'educacion', 'salud', 'tecnologia', 'otro',
  ], { message: 'Selecciona una categoría' }),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().max(200).optional(),
  city: z.string().default('Barcelona'),
  logo_url: z.string().url().optional(),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
