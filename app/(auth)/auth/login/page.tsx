'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { loginAction } from '@/actions/auth'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const result = await loginAction(data)
    if (result && 'error' in result) setServerError(result.error)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Bienvenido de vuelta</h1>
        <p className="text-gray-500 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-[#009C3B] font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#009C3B] hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
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

        {/* Server error */}
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
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-gray-400 text-xs">ou continue com</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Flags hint */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <span>🇧🇷</span>
        <span>Comunidade brasileira em Barcelona</span>
        <span>🏴󠁥󠁳󠁣󠁴󠁿</span>
      </div>
    </div>
  )
}
