'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Briefcase, Building2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { registerAction } from '@/actions/auth'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

const ROLES = [
  {
    value: 'user' as const,
    label: 'Soy profesional',
    description: 'Busco empleo o quiero conectar con la comunidad',
    icon: Briefcase,
  },
  {
    value: 'company' as const,
    label: 'Tengo una empresa',
    description: 'Quiero publicar empleos o registrar mi negocio',
    icon: Building2,
  },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user', terms: false },
  })

  const selectedRole = watch('role')
  const termsValue = watch('terms')

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null)
    const result = await registerAction(data)
    if ('error' in result) {
      setServerError(result.error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#009C3B]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">¡Cuenta creada!</h2>
        <p className="text-gray-500 mb-6">
          Revisa tu email y confirma el registro para poder entrar.
        </p>
        <Link href="/auth/login">
          <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
            Ir al login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Crea tu cuenta</h1>
        <p className="text-gray-500 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-[#009C3B] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Role selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Tipo de cuenta</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.value
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value)}
                  className={cn(
                    'flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all',
                    isSelected
                      ? 'border-[#009C3B] bg-[#009C3B]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isSelected ? 'text-[#009C3B]' : 'text-gray-400')} />
                  <span className={cn('font-semibold text-sm', isSelected ? 'text-[#009C3B]' : 'text-gray-700')}>
                    {role.label}
                  </span>
                  <span className="text-xs text-gray-400 leading-tight">{role.description}</span>
                </button>
              )
            })}
          </div>
          {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        </div>

        <FormField
          label="Nombre completo"
          type="text"
          autoComplete="name"
          placeholder="Ana Oliveira"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
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

        {/* Terms */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={termsValue}
            onCheckedChange={(v) => setValue('terms', v === true)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
            Acepto los{' '}
            <Link href="/terminos" className="text-[#009C3B] hover:underline">términos de uso</Link>
            {' '}y la{' '}
            <Link href="/privacidad" className="text-[#009C3B] hover:underline">política de privacidad</Link>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-500 -mt-3">{errors.terms.message}</p>}

        {/* Server error */}
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
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando cuenta...</>
          ) : (
            'Crear cuenta gratis'
          )}
        </Button>
      </form>
    </div>
  )
}
