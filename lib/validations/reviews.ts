import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Elige una puntuación').max(5),
  comment: z.string().max(1000).optional().or(z.literal('')),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export const reviewReplySchema = z.object({
  reply: z.string().min(1, 'Escribe una respuesta').max(500),
})

export type ReviewReplyInput = z.infer<typeof reviewReplySchema>
