import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número'),
  password_confirm: z.string(),
  role: z.enum(['user', 'company'], { message: 'Selecciona un tipo de cuenta' }),
  terms: z.boolean().refine((v) => v === true, 'Debes aceptar los términos'),
}).refine((d) => d.password === d.password_confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirm'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número'),
  password_confirm: z.string(),
}).refine((d) => d.password === d.password_confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirm'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
