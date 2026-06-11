'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Bucket = 'avatars' | 'companies' | 'events' | 'listings'

interface ImageUploadProps {
  bucket: Bucket
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  hint?: string
  aspectRatio?: 'square' | 'wide'
  className?: string
}

export function ImageUpload({ bucket, value, onChange, label, hint, aspectRatio = 'square', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const upload = useCallback(async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Debes iniciar sesión'); return }

      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (uploadError) { setError('Error al subir la imagen'); return }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
    } finally {
      setUploading(false)
    }
  }, [bucket, onChange, supabase])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Máx. 5 MB'); return }
    upload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  const remove = () => { onChange(null); if (inputRef.current) inputRef.current.value = '' }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !value && !uploading && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all overflow-hidden',
          aspectRatio === 'wide' ? 'aspect-[16/6]' : 'aspect-square max-w-[160px]',
          value ? 'border-transparent cursor-default' : 'border-gray-200 hover:border-[#009C3B] cursor-pointer hover:bg-green-50/30',
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove() }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#009C3B]" />
            <span className="text-xs">Subiendo...</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 p-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600">Subir imagen</p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP · máx. 5MB</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
    </div>
  )
}


// ─── Multi-image upload (for listings) ───────────────────────

interface MultiImageUploadProps {
  bucket: Bucket
  value: string[]
  onChange: (urls: string[]) => void
  max?: number
  label?: string
}

export function MultiImageUpload({ bucket, value, onChange, max = 5, label }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const upload = useCallback(async (files: FileList) => {
    if (value.length + files.length > max) { setError(`Máximo ${max} imágenes`); return }
    setError(null)
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Debes iniciar sesión'); return }

      const urls: string[] = []
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) continue
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path)
          urls.push(data.publicUrl)
        }
      }
      onChange([...value, ...urls])
    } finally {
      setUploading(false)
    }
  }, [bucket, value, onChange, max, supabase])

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx))

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#009C3B] hover:bg-green-50/30 flex flex-col items-center justify-center gap-1.5 text-gray-400 transition-all"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#009C3B]" /> : <ImageIcon className="w-5 h-5" />}
            <span className="text-xs">{uploading ? 'Subiendo...' : 'Añadir'}</span>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">{value.length}/{max} imágenes · JPG, PNG, WEBP · máx. 5MB c/u</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />
    </div>
  )
}
