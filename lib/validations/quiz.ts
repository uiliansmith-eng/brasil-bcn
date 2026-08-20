import { z } from 'zod'

export const quizMetaSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(150, 'Máximo 150 caracteres'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
  cover_image: z.string().url('URL inválida').optional().or(z.literal('')),
  estimated_minutes: z.coerce.number().int().min(1).max(30),
})
export type QuizMetaInput = z.infer<typeof quizMetaSchema>

export const quizResultSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  icon: z.string().max(10).optional().or(z.literal('')),
  subtitle: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  ideal_role: z.string().max(300).optional().or(z.literal('')),
})
export type QuizResultInput = z.infer<typeof quizResultSchema>

export const quizQuestionSchema = z.object({
  question: z.string().min(5, 'Mínimo 5 caracteres').max(300),
})
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>

export const quizAnswerSchema = z.object({
  answer: z.string().min(1, 'Escribe la respuesta').max(300),
  result_id: z.string().uuid('Selecciona un resultado'),
})
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>
