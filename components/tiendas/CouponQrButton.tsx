'use client'

import { useState } from 'react'
import QRCode from 'qrcode'
import { Loader2, QrCode, X } from 'lucide-react'
import { claimCouponQrAction } from '@/actions/coupons'

interface CouponQrButtonProps {
  couponId: string
  couponTitle: string
}

export function CouponQrButton({ couponId, couponTitle }: CouponQrButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  const handleClaim = async () => {
    setLoading(true)
    setError(null)
    const result = await claimCouponQrAction(couponId)
    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }
    const dataUrl = await QRCode.toDataURL(result.code, { width: 240, margin: 1 })
    setQrImage(dataUrl)
    setCode(result.code)
    setLoading(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClaim}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#009C3B]/30 text-[#009C3B] bg-white hover:bg-[#009C3B]/5 transition-colors shrink-0"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
        Obtener QR
      </button>

      {(qrImage || error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center relative">
            <button
              type="button"
              onClick={() => { setQrImage(null); setError(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {error ? (
              <div className="py-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : (
              <>
                <h3 className="font-black text-gray-900 mb-1">{couponTitle}</h3>
                <p className="text-gray-400 text-xs mb-4">Muestra este código en la tienda</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImage!} alt="Código QR del cupón" className="mx-auto rounded-xl border border-gray-100" />
                <p className="font-mono font-bold text-gray-700 text-sm mt-4">{code}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
