'use client'

import { useState } from 'react'
import { ShieldOff, ShieldCheck, Loader2 } from 'lucide-react'
import { blockUser, unblockUser } from '@/actions/admin'

export function UserActions({ userId, isBlocked }: { userId: string; isBlocked: boolean }) {
  const [loading, setLoading] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [reason, setReason] = useState('')

  async function handleUnblock() {
    setLoading(true)
    await unblockUser(userId)
    setLoading(false)
  }

  async function handleBlock() {
    if (!reason.trim()) return
    setLoading(true)
    setShowReasonModal(false)
    await blockUser(userId, reason.trim())
    setReason('')
    setLoading(false)
  }

  if (isBlocked) {
    return (
      <button
        onClick={handleUnblock}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        Desbloquear
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowReasonModal(true)}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldOff className="w-3.5 h-3.5" />}
        Bloquear
      </button>

      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-black text-gray-900 mb-1">Bloquear usuario</h3>
            <p className="text-sm text-gray-500 mb-4">El usuario no podrá acceder a la plataforma.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo (ej: contenido ofensivo, spam...)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowReasonModal(false); setReason('') }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleBlock}
                disabled={!reason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40"
              >
                Confirmar bloqueo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
