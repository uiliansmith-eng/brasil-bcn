'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { forgotPasswordAction } from '@/actions/auth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { useLang } from '@/lib/auth-i18n'

export default function ForgotPasswordPage() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null)
    const result = await forgotPasswordAction(data)
    if ('error' in result) {
      setServerError(result.error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#002776]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">{t('forgot_sent_title')}</h2>
        <p className="text-gray-500 mb-2">
          {t('forgot_sent_pre')}<strong>{getValues('email')}</strong>{t('forgot_sent_suf')}
        </p>
        <p className="text-gray-400 text-sm mb-8">{t('forgot_sent_spam')}</p>
        <Link href="/auth/login">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('forgot_back')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/auth/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('forgot_back')}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-2">{t('forgot_title')}</h1>
        <p className="text-gray-500 text-sm">{t('forgot_desc')}</p>
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
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('forgot_loading')}</>
          ) : (
            t('forgot_submit')
          )}
        </Button>
      </form>
    </div>
  )
}
