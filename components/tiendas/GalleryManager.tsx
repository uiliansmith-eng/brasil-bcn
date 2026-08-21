'use client'

import { useState } from 'react'
import { Loader2, X, Images } from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { updateStoreGalleryAction } from '@/actions/stores'

interface GalleryManagerProps {
  companyId: string
  initialGallery: string[]
  moduleActive: boolean
}

export function GalleryManager({ companyId, initialGallery, moduleActive }: GalleryManagerProps) {
  const [gallery, setGallery] = useState<string[]>(initialGallery)
  const [saving, setSaving] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  const save = async (next: string[]) => {
    setSaving(true)
    const result = await updateStoreGalleryAction(companyId, next)
    setSaving(false)
    if ('ok' in result) setGallery(next)
  }

  const handleAdd = (url: string | null) => {
    if (!url) return
    setPendingUrl(null)
    save([...gallery, url])
  }

  const handleRemove = (url: string) => {
    save(gallery.filter((g) => g !== url))
  }

  if (!moduleActive) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
          <Images className="w-5 h-5 text-[#009C3B]" /> Galería
        </h2>
        <p className="text-gray-400 text-sm">Activa el módulo &quot;Galería&quot; arriba para añadir fotos de tu tienda.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <Images className="w-5 h-5 text-[#009C3B]" /> Galería
        </h2>
        {saving && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
      </div>
      <p className="text-gray-400 text-sm mb-5">Hasta 20 fotos de tu tienda, productos o servicios.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
        {gallery.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {gallery.length < 20 && (
        <ImageUpload
          bucket="companies"
          value={pendingUrl}
          onChange={handleAdd}
          label="Añadir foto"
          aspectRatio="square"
          className="[&>div]:max-w-[120px]"
        />
      )}
    </div>
  )
}
