'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Tag, Loader2 } from 'lucide-react'
import { deleteJobAction } from '@/actions/jobs'
import { deleteListingAction, markListingSoldAction } from '@/actions/listings'
import { cn } from '@/lib/utils'

type Props =
  | { type: 'job'; id: string }
  | { type: 'listing'; id: string; isSold: boolean }

export function DashboardItemActions(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const editHref = props.type === 'job' ? `/empleos/editar/${props.id}` : `/compraventa/editar/${props.id}`

  function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    startTransition(async () => {
      if (props.type === 'job') await deleteJobAction(props.id)
      else await deleteListingAction(props.id)
      setConfirming(false)
      router.refresh()
    })
  }

  function handleToggleSold() {
    if (props.type !== 'listing') return
    startTransition(async () => {
      await markListingSoldAction(props.id, !props.isSold)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      {props.type === 'listing' && (
        <button
          type="button"
          onClick={handleToggleSold}
          disabled={isPending}
          title={props.isSold ? 'Marcar como disponible' : 'Marcar como vendido'}
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border transition-colors',
            props.isSold
              ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
              : 'border-[#009C3B]/30 text-[#009C3B] hover:bg-[#009C3B]/5'
          )}
        >
          <Tag className="w-3 h-3" />
          {props.isSold ? 'Reactivar' : 'Vendido'}
        </button>
      )}

      <Link
        href={editHref}
        title="Editar"
        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        onBlur={() => setConfirming(false)}
        disabled={isPending}
        title="Eliminar"
        className={cn(
          'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors',
          confirming ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
        )}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        {confirming && '¿Confirmar?'}
      </button>
    </div>
  )
}
