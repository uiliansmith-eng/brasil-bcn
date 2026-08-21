'use client'

import { useState } from 'react'
import { Link as LinkIcon, Check, MessageCircle, Users } from 'lucide-react'
import { siteConfig } from '@/lib/config'

interface ReferralCardProps {
  code: string
  count: number
}

export function ReferralCard({ code, count }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)
  const referralUrl = `${siteConfig.url}/?ref=${code}`
  const shareText = `Entrei na BrasilBCN e tá top pra achar emprego, eventos e comunidade brasileira em Barcelona. Dá uma olhada:`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl)
    } catch {
      const input = document.createElement('input')
      input.value = referralUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-[#009C3B]" />
        <h2 className="font-bold text-gray-900 text-sm">Convide amigos</h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Compartilhe seu link. {count > 0 ? (
          <>Já trouxe <strong className="text-gray-600">{count} pessoa{count !== 1 ? 's' : ''}</strong> pra BrasilBCN.</>
        ) : (
          'Ainda não trouxe ninguém — comece agora.'
        )}
      </p>

      <div className="flex gap-2">
        <div className="flex-1 min-w-0 h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center text-xs text-gray-500 truncate">
          {referralUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 h-10 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#009C3B]" /> : <LinkIcon className="w-3.5 h-3.5" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 h-10 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </div>
  )
}
