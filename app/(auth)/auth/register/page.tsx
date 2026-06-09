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
import { useLang } from '@/lib/auth-i18n'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const { t } = useLang()
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
        <h2 className="text-2xl font-black text-gray-900 mb-3">{t('reg_success_title')}</h2>
        <p className="text-gray-500 mb-6">{t('reg_success_desc')}</p>
        <Link href="/auth/login">
          <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
            {t('reg_go_login')}
          </Button>
        </Link>
      </div>
    )
  }

  const roles = [
    {
      value: 'user' as const,
      label: t('reg_role_user'),
      description: t('reg_role_user_desc'),
      icon: Briefcase,
    },
    {
      value: 'company' as const,
      label: t('reg_role_company'),
      description: t('reg_role_company_desc'),
      icon: Building2,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">{t('reg_title')}</h1>
        <p className="text-gray-500 text-sm">
          {t('reg_sub')}{' '}
          <Link href="/auth/login" className="text-[#009C3B] font-semibold hover:underline">
            {t('reg_sub_link')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{t('reg_account_type')}</p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => {
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
          label={t('reg_full_name')}
          type="text"
          autoComplete="name"
          placeholder="Ana Oliveira"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <FormField
          label={t('reg_email')}
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">{t('reg_password')}</label>
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
            : <p className="text-xs text-gray-400">{t('reg_password_hint')}</p>
          }
        </div>

        <FormField
          label={t('reg_confirm_password')}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirm?.message}
          {...register('password_confirm')}
        />

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={termsValue}
            onCheckedChange={(v) => setValue('terms', v === true)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
            {t('reg_terms_pre')}
            <Link href="/terminos" className="text-[#009C3B] hover:underline">{t('reg_terms_link')}</Link>
            {t('reg_terms_mid')}
            <Link href="/privacidad" className="text-[#009C3B] hover:underline">{t('reg_privacy_link')}</Link>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-500 -mt-3">{errors.terms.message}</p>}

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
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('reg_loading')}</>
          ) : (
            t('reg_submit')
          )}
        </Button>
      </form>
    </div>
  )
}
