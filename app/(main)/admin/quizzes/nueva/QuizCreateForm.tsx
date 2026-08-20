'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createQuizAction } from '@/actions/quiz'
import { quizMetaSchema, type QuizMetaInput } from '@/lib/validations/quiz'

export function QuizCreateForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuizMetaInput>({
    resolver: zodResolver(quizMetaSchema),
    defaultValues: { title: '', description: '', cover_image: '', estimated_minutes: 2 },
  })

  async function onSubmit(data: QuizMetaInput) {
    setServerError(null)
    const result = await createQuizAction(data)
    if ('error' in result) { setServerError(result.error); return }
    router.push(`/admin/quizzes/${result.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5 max-w-xl">
      {serverError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-sm text-red-700">{serverError}</div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Título del quiz *</label>
        <input
          {...register('title')}
          placeholder="Que tipo de brasileiro você é em Barcelona?"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (intro)</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Descubra qual é o seu perfil de brasileiro vivendo em Barcelona."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Minutos estimados</label>
        <input
          {...register('estimated_minutes')}
          type="number"
          min={1}
          max={30}
          className="w-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
        />
        {errors.estimated_minutes && <p className="mt-1 text-xs text-red-500">{errors.estimated_minutes.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 px-6 rounded-xl bg-[#002776] hover:bg-[#001a5c] text-white font-bold text-sm transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Crear quiz y continuar
      </button>
      <p className="text-xs text-gray-400">Después podrás añadir resultados y preguntas. El quiz se crea como borrador.</p>
    </form>
  )
}
