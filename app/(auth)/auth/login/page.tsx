'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { useLang } from '@/lib/auth-i18n'

export default function LoginPage() {
  const { t } = useLang()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setServerError('Email o contraseña incorrectos')
      } else if (error.message.includes('Email not confirmed')) {
        setServerError('Confirma tu email antes de entrar. Revisa tu bandeja de entrada.')
      } else {
        setServerError('Error al iniciar sesión. Inténtalo de nuevo.')
      }
      return
    }

    const params = new URLSearchParams(window.location.search)
    window.location.href = params.get('redirect') || '/admin'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">{t('login_title')}</h1>
        <p className="text-gray-500 text-sm">
          {t('login_sub')}{' '}
          <Link href="/auth/register" className="text-[#009C3B] font-semibold hover:underline">
            {t('login_sub_link')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label={t('login_email')}
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{t('login_password')}</label>
            <Link href="/auth/forgot-password" className="text-xs text-[#009C3B] hover:underline font-medium">
              {t('login_forgot')}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full h-11 px-3 pr-11 rounded-xl border text-sm transition-colors outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold rounded-xl transition-all"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('login_loading')}</>
          ) : (
            t('login_submit')
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 mt-8 text-gray-400 text-sm">
        <span>🇧🇷</span>
        <span>{t('login_community')}</span>
        <span>🏴󠁥󠁳󠁣󠁴󠁿</span>
      </div>
    </div>
  )
}
