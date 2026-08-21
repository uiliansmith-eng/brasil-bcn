'use client'

import { useRef, useState } from 'react'
import { Loader2, X, Images, Video, PlayCircle } from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { updateStoreGalleryAction } from '@/actions/stores'
import { createClient } from '@/lib/supabase/client'
import { isVideoUrl } from '@/lib/media'

interface GalleryManagerProps {
  companyId: string
  initialGallery: string[]
  moduleActive: boolean
}

const MAX_VIDEO_MB = 50

export function GalleryManager({ companyId, initialGallery, moduleActive }: GalleryManagerProps) {
  const [gallery, setGallery] = useState<string[]>(initialGallery)
  const [saving, setSaving] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

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

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoError(null)

    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setVideoError(`Máx. ${MAX_VIDEO_MB} MB`)
      if (videoInputRef.current) videoInputRef.current.value = ''
      return
    }

    setUploadingVideo(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setVideoError('Debes iniciar sesión'); return }

      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('store-gallery').upload(path, file, { upsert: true })
      if (uploadError) { setVideoError('Error al subir el vídeo'); return }

      const { data } = supabase.storage.from('store-gallery').getPublicUrl(path)
      await save([...gallery, data.publicUrl])
    } finally {
      setUploadingVideo(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  if (!moduleActive) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
          <Images className="w-5 h-5 text-[#009C3B]" /> Galería
        </h2>
        <p className="text-gray-400 text-sm">Activa el módulo &quot;Galería&quot; arriba para añadir fotos y vídeos de tu tienda.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <Images className="w-5 h-5 text-[#009C3B]" /> Galería
        </h2>
        {(saving || uploadingVideo) && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
      </div>
      <p className="text-gray-400 text-sm mb-5">Hasta 20 fotos o vídeos de tu tienda, productos o servicios.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
        {gallery.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
            {isVideoUrl(url) ? (
              <>
                <video src={url} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="w-full h-full object-cover" />
            )}
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
        <div className="flex flex-wrap items-start gap-4">
          <ImageUpload
            bucket="store-gallery"
            value={pendingUrl}
            onChange={handleAdd}
            label="Añadir foto"
            aspectRatio="square"
            className="[&>div]:max-w-[120px]"
          />

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-700">Añadir vídeo</p>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className="w-[120px] aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#009C3B] hover:bg-green-50/30 flex flex-col items-center justify-center gap-2 text-gray-400 transition-all"
            >
              {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin text-[#009C3B]" /> : <Video className="w-5 h-5" />}
              <span className="text-xs text-center px-2">{uploadingVideo ? 'Subiendo...' : `MP4, WEBM · máx. ${MAX_VIDEO_MB}MB`}</span>
            </button>
            {videoError && <p className="text-xs text-red-500">{videoError}</p>}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleVideoFile}
            />
          </div>
        </div>
      )}
    </div>
  )
}
