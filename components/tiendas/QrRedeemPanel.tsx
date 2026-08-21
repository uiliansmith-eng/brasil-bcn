'use client'

import { useState } from 'react'
import { Loader2, ScanLine, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { redeemQrCodeAction } from '@/actions/coupons'

interface QrRedeemPanelProps {
  companyId: string
}

export function QrRedeemPanel({ companyId }: QrRedeemPanelProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await redeemQrCodeAction(companyId, code)
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setSuccess(`Cupón "${result.couponTitle}" canjeado correctamente.`)
    setCode('')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
        <ScanLine className="w-5 h-5 text-[#009C3B]" /> Canjear cupón QR
      </h2>
      <p className="text-gray-400 text-sm mb-5">Pide al cliente el código de su cupón y escríbelo aquí para validarlo.</p>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código del cupón"
          className="flex-1 h-11 px-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20"
        />
        <Button type="submit" disabled={loading} className="h-11 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Canjear'}
        </Button>
      </form>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      {success && (
        <p className="text-sm text-[#009C3B] mt-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </p>
      )}
    </div>
  )
}
