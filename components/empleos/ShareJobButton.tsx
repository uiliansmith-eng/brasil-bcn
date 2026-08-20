'use client'

import { Share2 } from 'lucide-react'

export function ShareJobButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => navigator.share?.({ title, url: window.location.href })}
      className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
    >
      <Share2 className="w-4 h-4" /> Compartir
    </button>
  )
}
