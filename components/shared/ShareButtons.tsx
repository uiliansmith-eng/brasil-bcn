'use client'

import { useEffect, useState } from 'react'
import { Share2, MessageCircle, Link as LinkIcon, Check } from 'lucide-react'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

interface ShareButtonsProps {
  title: string
  text?: string
  url?: string
  className?: string
}

export function ShareButtons({ title, text, url, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = text ?? title

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl })
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') console.error('[ShareButtons] native share failed:', e)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={className ?? 'flex gap-2'}>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-colors"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 text-[#1877F2] hover:bg-gray-50 transition-colors"
        aria-label="Compartir en Facebook"
      >
        <FacebookIcon />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-semibold"
      >
        {copied ? <Check className="w-4 h-4 text-[#009C3B]" /> : <LinkIcon className="w-4 h-4" />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Compartir"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
