'use client'

import { useState } from 'react'
import { blockUser, unblockUser } from '@/actions/admin'
import { useRouter } from 'next/navigation'
import { Ban, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  userId: string
  isBlocked: boolean
  blockedReason: string
}

export function UserActions({ userId, isBlocked, blockedReason }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState('')

  const handleBlock = async () => {
    setLoading(true)
    const { error } = await blockUser(userId, reason)
    setLoading(false)
    if (error) { alert(error); return }
    setShowModal(false)
    router.refresh()
  }

  const handleUnblock = async () => {
    setLoading(true)
    const { error } = await unblockUser(userId)
    setLoading(false)
    if (error) { alert(error); return }
    router.refresh()
  }

  if (isBlocked) {
    return (
      <button
        onClick={handleUnblock}
        disabled={loading}
        className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
        Desbloquear
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
      >
        <Ban className="w-3 h-3" />
        Bloquear
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-gray-900 mb-2">Bloquear usuario</h3>
            <p className="text-sm text-gray-500 mb-4">El usuario no podrá acceder a la plataforma. Indica el motivo:</p>
            <textarea
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 mb-4"
              rows={3}
              placeholder="Ej: publicó contenido inapropiado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button
                onClick={handleBlock}
                disabled={loading || !reason.trim()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar bloqueo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
