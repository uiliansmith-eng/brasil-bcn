'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavoriteStoreAction } from '@/actions/favorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  companyId: string
  initialFavorited: boolean
}

export function FavoriteButton({ companyId, initialFavorited }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    setError(null)
    startTransition(async () => {
      const result = await toggleFavoriteStoreAction(companyId)
      if ('error' in result) { setError(result.error); return }
      setFavorited(result.favorited)
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          'flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors',
          favorited ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-500 hover:border-red-200'
        )}
      >
        <Heart className={cn('w-4 h-4', favorited && 'fill-red-500 text-red-500')} />
        {favorited ? 'Guardada' : 'Guardar'}
      </button>
      {error && <p className="absolute top-full mt-1 right-0 text-xs text-red-500 whitespace-nowrap">{error}</p>}
    </div>
  )
}
