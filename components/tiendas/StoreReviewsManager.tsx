'use client'

import { useState } from 'react'
import { Star, EyeOff, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { replyToReviewAction, toggleReviewHiddenAction } from '@/actions/reviews'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

interface StoreReviewsManagerProps {
  reviews: (Review & { user: { full_name: string | null } | null })[]
}

function ReplyForm({ reviewId, onDone }: { reviewId: string; onDone: () => void }) {
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSubmitting(true)
    await replyToReviewAction(reviewId, { reply })
    setSubmitting(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex items-start gap-2">
      <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Responder..." className="resize-none flex-1" />
      <Button type="submit" size="sm" disabled={submitting} className="bg-[#009C3B] hover:bg-[#007a2f] text-white shrink-0">
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Enviar'}
      </Button>
    </form>
  )
}

export function StoreReviewsManager({ reviews }: StoreReviewsManagerProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Todavía no recibiste reseñas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className={cn('bg-white rounded-2xl border p-5', review.is_hidden ? 'border-red-100 opacity-60' : 'border-gray-100')}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{review.user?.full_name ?? 'Usuario'}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={cn('w-3.5 h-3.5', n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                ))}
              </div>
            </div>
            <form action={toggleReviewHiddenAction}>
              <input type="hidden" name="id" value={review.id} />
              <input type="hidden" name="is_hidden" value={String(review.is_hidden)} />
              <button type="submit" className="text-gray-400 hover:text-gray-700" title={review.is_hidden ? 'Mostrar' : 'Ocultar'}>
                {review.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {review.comment && <p className="text-gray-600 text-sm mb-2">{review.comment}</p>}

          {review.reply ? (
            <div className="mt-2 ml-3 pl-3 border-l-2 border-[#009C3B]/30">
              <p className="text-xs font-semibold text-gray-600">Tu respuesta</p>
              <p className="text-sm text-gray-500">{review.reply}</p>
            </div>
          ) : replyingTo === review.id ? (
            <ReplyForm reviewId={review.id} onDone={() => setReplyingTo(null)} />
          ) : (
            <button type="button" onClick={() => setReplyingTo(review.id)} className="text-xs font-semibold text-[#009C3B] hover:text-[#007a2f]">
              Responder
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
