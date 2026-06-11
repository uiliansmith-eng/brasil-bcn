'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2, User, Phone, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { updateProfileAction } from '@/actions/profile'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  phone: z.string().max(20).optional().or(z.literal('')),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  bio: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(60).optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

const roleLabels: Record<string, string> = {
  user: 'Usuario',
  company: 'Empresa',
  admin: 'Admin',
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      whatsapp: profile.whatsapp ?? '',
      bio: profile.bio ?? '',
      city: profile.city ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    setSaved(false)
    const result = await updateProfileAction({ ...data, avatar_url: avatarUrl ?? undefined })
    if ('error' in result) {
      setServerError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b bg-gray-50">
        <div className="shrink-0">
          <ImageUpload
            bucket="avatars"
            value={avatarUrl}
            onChange={setAvatarUrl}
            aspectRatio="square"
            className="[&>div]:max-w-[64px] [&>div]:rounded-2xl"
          />
        </div>
        <div>
          <p className="font-bold text-gray-900">{profile.full_name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#009C3B]/10 text-[#009C3B]">
            {roleLabels[profile.role] ?? profile.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Full name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <User className="w-3.5 h-3.5 text-gray-400" /> Nombre completo
          </label>
          <input
            {...register('full_name')}
            className={cn(
              'w-full h-11 px-3 rounded-xl border text-sm outline-none transition-colors focus:ring-2',
              errors.full_name
                ? 'border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20'
            )}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> Ciudad
          </label>
          <input
            {...register('city')}
            placeholder="Barcelona"
            className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20"
          />
        </div>

        {/* Phone + WhatsApp */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Teléfono
            </label>
            <input
              {...register('phone')}
              placeholder="+34 600 000 000"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <span className="text-sm">💬</span> WhatsApp
            </label>
            <input
              {...register('whatsapp')}
              placeholder="+34 600 000 000"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <FileText className="w-3.5 h-3.5 text-gray-400" /> Sobre mí
            <span className="text-gray-400 font-normal text-xs ml-auto">máx. 300 caracteres</span>
          </label>
          <textarea
            {...register('bio')}
            rows={3}
            placeholder="Cuéntanos algo sobre ti..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-colors focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 resize-none"
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold rounded-xl px-6"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
            ) : 'Guardar cambios'}
          </Button>
          {saved && (
            <div className="flex items-center gap-1.5 text-[#009C3B] text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> ¡Guardado!
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
