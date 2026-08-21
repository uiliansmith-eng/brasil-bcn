'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface FloatingCartButtonProps {
  companyId: string
  storeSlug: string
}

export function FloatingCartButton({ companyId, storeSlug }: FloatingCartButtonProps) {
  const { count, subtotal } = useCart(companyId)

  if (count === 0) return null

  return (
    <Link
      href={`/tiendas/${storeSlug}/checkout`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold pl-4 pr-5 py-3.5 rounded-2xl shadow-lg transition-colors"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-white text-[#009C3B] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      </div>
      <span className="text-sm">{subtotal.toLocaleString('es-ES')}€</span>
    </Link>
  )
}
