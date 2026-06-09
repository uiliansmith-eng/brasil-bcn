'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { resetPasswordAction } from '@/actions/auth'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null)
    const result = await resetPasswordAction(data)
    if (result && 'error' in result) setServerError(result.error)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Nueva contraseña</h1>
        <p className="text-gray-500 text-sm">Elige una contraseña segura para tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(
                'w-full h-11 px-3 pr-11 rounded-xl border text-sm transition-colors outline-none focus:ring-2',
                errors.password
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password
            ? <p className="text-sm text-red-500">{errors.password.message}</p>
            : <p className="text-xs text-gray-400">Mínimo 8 caracteres, una mayúscula y un número</p>
          }
        </div>

        <FormField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirm?.message}
          {...register('password_confirm')}
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold rounded-xl"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
          ) : (
            'Guardar contraseña'
          )}
        </Button>
      </form>
    </div>
  )
}
