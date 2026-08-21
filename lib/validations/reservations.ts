import { z } from 'zod'

export const reservationSchema = z.object({
  customer_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  customer_phone: z.string().min(6, 'Teléfono inválido').max(30),
  date: z.string().min(1, 'Elige una fecha'),
  start_time: z.string().min(1, 'Elige un horario'),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type ReservationInput = z.infer<typeof reservationSchema>

export const availabilityDaySchema = z.object({
  weekday: z.number().int().min(0).max(6),
  is_closed: z.boolean(),
  open_time: z.string().optional().or(z.literal('')),
  close_time: z.string().optional().or(z.literal('')),
})

export type AvailabilityDayInput = z.infer<typeof availabilityDaySchema>
