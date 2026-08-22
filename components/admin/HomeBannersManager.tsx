'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { createHomeBannerAction, togglePromotionActiveAction, deletePromotionAction } from '@/actions/promotions'
import { homeBannerSchema, type HomeBannerInput } from '@/lib/validations/promotions'
import type { Promotion } from '@/types'

interface HomeBannersManagerProps {
  banners: Promotion[]
}

export function HomeBannersManager({ banners }: HomeBannersManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HomeBannerInput>({
    resolver: zodResolver(homeBannerSchema),
    defaultValues: { is_active: true },
  })

  const onSubmit = async (data: HomeBannerInput) => {
    setServerError(null)
    const result = await createHomeBannerAction(data)
    if ('error' in result) { setServerError(result.error); return }
    reset({ is_active: true, title: '', image_url: '', link_url: '', starts_at: '', ends_at: '' })
    setShowForm(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#009C3B]" /> Banners de portada
        </h2>
        {!showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]">
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Banners curados por el equipo, se muestran rotando en la portada de brasilbcn.com. No son anuncios pagados (eso está en Publicidad).
      </p>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 p-4 bg-gray-50 rounded-xl space-y-3">
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <FormField label="Título *" placeholder="Ej: Semana de Brasil en BCN" error={errors.title?.message} {...register('title')} />
          <FormField label="URL de imagen *" placeholder="https://..." error={errors.image_url?.message} {...register('image_url')} />
          <FormField label="URL de destino *" placeholder="https://..." error={errors.link_url?.message} {...register('link_url')} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Desde (opcional)" type="date" {...register('starts_at')} />
            <FormField label="Hasta (opcional)" type="date" {...register('ends_at')} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Crear'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {banners.length === 0 ? (
        <p className="text-gray-400 text-sm">Todavía no hay banners de portada.</p>
      ) : (
        <div className="space-y-2">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
              {banner.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={banner.image_url} alt={banner.title} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-gray-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{banner.title}</p>
                <p className="text-xs text-gray-400 truncate">{banner.link_url}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${banner.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {banner.is_active ? 'Activo' : 'Pausado'}
              </span>
              <form action={togglePromotionActiveAction}>
                <input type="hidden" name="id" value={banner.id} />
                <input type="hidden" name="is_active" value={String(banner.is_active)} />
                <button type="submit" className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  {banner.is_active ? 'Pausar' : 'Activar'}
                </button>
              </form>
              <form action={deletePromotionAction}>
                <input type="hidden" name="id" value={banner.id} />
                <button type="submit" className="text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
