'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { BookingForm } from './BookingForm'

interface ReserveButtonProps {
  companyId: string
  storeSlug: string
  storeItemId: string
  itemName: string
}

export function ReserveButton({ companyId, storeSlug, storeItemId, itemName }: ReserveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#002776]/30 text-[#002776] bg-white hover:bg-[#002776]/5 transition-colors shrink-0"
      >
        <CalendarClock className="w-3.5 h-3.5" /> Reservar
      </button>
      {open && (
        <BookingForm
          companyId={companyId}
          storeSlug={storeSlug}
          storeItemId={storeItemId}
          itemName={itemName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
