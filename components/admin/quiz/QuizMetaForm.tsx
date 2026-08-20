'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Check } from 'lucide-react'
import { updateQuizMetaAction } from '@/actions/quiz'
import { quizMetaSchema, type QuizMetaInput } from '@/lib/validations/quiz'
import { ImageUpload } from '@/components/ui/ImageUpload'
import type { Quiz } from '@/types'

export function QuizMetaForm({ quiz }: { quiz: Quiz }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuizMetaInput>({
    resolver: zodResolver(quizMetaSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description ?? '',
      cover_image: quiz.cover_image ?? '',
      estimated_minutes: quiz.estimated_minutes,
    },
  })

  async function onSubmit(data: QuizMetaInput) {
    setServerError(null)
    setSaved(false)
    const result = await updateQuizMetaAction(quiz.id, data)
    if ('error' in result) { setServerError(result.error); return }
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <h2 className="font-black text-gray-900">Información básica</h2>

      {serverError && <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-sm text-red-700">{serverError}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Título</label>
        <input {...register('title')} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Descripción (intro)</label>
        <textarea {...register('description')} rows={2} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Minutos estimados</label>
          <input {...register('estimated_minutes')} type="number" min={1} max={30} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]" />
        </div>
        <div className="text-xs text-gray-400 flex items-end pb-2.5">
          <span>Slug: <code className="bg-gray-50 px-1.5 py-0.5 rounded">{quiz.slug}</code></span>
        </div>
      </div>

      <ImageUpload
        bucket="quizzes"
        value={watch('cover_image') || null}
        onChange={(url) => setValue('cover_image', url ?? '')}
        label="Imagen de portada (opcional)"
        aspectRatio="wide"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 px-5 rounded-xl bg-[#002776] hover:bg-[#001a5c] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? 'Guardado' : 'Guardar cambios'}
      </button>
    </form>
  )
}
