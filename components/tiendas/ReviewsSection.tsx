'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, Loader2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getStoreReviews, getMyReview, submitReviewAction } from '@/actions/reviews'
import { reviewSchema, type ReviewInput } from '@/lib/validations/reviews'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewsSectionProps {
  companyId: string
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={cn('w-4 h-4', n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
        </button>
      ))}
    </div>
  )
}

export function ReviewsSection({ companyId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<(Review & { user: { full_name: string | null; avatar_url: string | null } | null })[]>([])
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    Promise.all([getStoreReviews(companyId), getMyReview(companyId)]).then(([all, mine]) => {
      setReviews(all as typeof reviews)
      setMyReview(mine)
      setLoading(false)
    })
  }

  useEffect(load, [companyId])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: myReview?.rating ?? 5, comment: myReview?.comment ?? '' },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewInput) => {
    const result = await submitReviewAction(companyId, data)
    if ('ok' in result) { setShowForm(false); load() }
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  if (loading) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#009C3B]" /> Reseñas
          {reviews.length > 0 && (
            <span className="text-sm font-medium text-gray-400">({avgRating.toFixed(1)} · {reviews.length})</span>
          )}
        </h2>
        {!showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]">
            {myReview ? 'Editar mi reseña' : 'Dejar una reseña'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
          <StarRating value={rating} onChange={(v) => setValue('rating', v)} />
          <Textarea rows={2} placeholder="Cuéntanos tu experiencia (opcional)" className="bg-white resize-none" {...register('comment')} />
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Publicar'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">Todavía no hay reseñas.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">{review.user?.full_name ?? 'Usuario'}</p>
                <StarRating value={review.rating} />
              </div>
              {review.comment && <p className="text-gray-500 text-sm">{review.comment}</p>}
              {review.reply && (
                <div className="mt-2 ml-3 pl-3 border-l-2 border-[#009C3B]/30">
                  <p className="text-xs font-semibold text-gray-600">Respuesta de la tienda</p>
                  <p className="text-sm text-gray-500">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
