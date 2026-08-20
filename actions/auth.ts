'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations/auth'

type ActionResult = { error: string } | { success: string } | never

// ─── LOGIN ───────────────────────────────────────────────────
export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email o contraseña incorrectos' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Confirma tu email antes de entrar. Revisa tu bandeja de entrada.' }
    }
    return { error: 'Error al iniciar sesión. Inténtalo de nuevo.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// ─── LOGOUT ──────────────────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────
export async function forgotPasswordAction(data: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) return { error: 'Error al enviar el email. Inténtalo de nuevo.' }

  return { success: 'Email enviado. Revisa tu bandeja de entrada.' }
}

// ─── RESET PASSWORD ──────────────────────────────────────────
export async function resetPasswordAction(data: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) return { error: 'Error al actualizar la contraseña. El enlace puede haber expirado.' }

  revalidatePath('/', 'layout')
  redirect('/?reset=success')
}
