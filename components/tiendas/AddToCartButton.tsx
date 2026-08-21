'use client'

import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  companyId: string
  storeItemId: string
  name: string
  price: number
  imageUrl: string | null
}

export function AddToCartButton({ companyId, storeItemId, name, price, imageUrl }: AddToCartButtonProps) {
  const { addItem } = useCart(companyId)
  const [justAdded, setJustAdded] = useState(false)

  const handleClick = () => {
    addItem({ storeItemId, name, price, imageUrl })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shrink-0',
        justAdded
          ? 'bg-[#009C3B] text-white border-[#009C3B]'
          : 'bg-white text-[#009C3B] border-[#009C3B]/30 hover:bg-[#009C3B]/5'
      )}
    >
      {justAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
      {justAdded ? 'Añadido' : 'Añadir'}
    </button>
  )
}
