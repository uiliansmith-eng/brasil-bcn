'use client'

import { useState } from 'react'
import { Share2, MessageCircle, Link as LinkIcon, Download, Check, Loader2 } from 'lucide-react'
import { logQuizEvent } from '@/actions/quiz'
import { getQuizSessionId, detectSource, canShareFiles } from '@/lib/quiz-client'

interface ShareResultProps {
  quizId: string
  quizSlug: string
  resultId: string
  resultSlug: string
  resultTitle: string
  shareUrl: string
}

async function fetchShareImage(quizSlug: string, resultSlug: string, format: 'story' | 'feed' | 'square') {
  const res = await fetch(`/api/quiz/share-image?quiz=${quizSlug}&result=${resultSlug}&format=${format}`)
  if (!res.ok) throw new Error('image fetch failed')
  return res.blob()
}

export function ShareResult({ quizId, quizSlug, resultId, resultSlug, resultTitle, shareUrl }: ShareResultProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const shareText = `Eu sou ${resultTitle}! 🇧🇷 Faça o quiz e descubra o seu:`

  function track(eventType: 'share_clicked' | 'instagram_share_clicked' | 'whatsapp_share_clicked' | 'share_image_downloaded') {
    logQuizEvent({ quizId, sessionId: getQuizSessionId(), eventType, resultId, source: detectSource() })
  }

  async function handleInstagramShare() {
    setLoadingAction('instagram')
    track('share_clicked')
    track('instagram_share_clicked')
    try {
      const blob = await fetchShareImage(quizSlug, resultSlug, 'story')
      const file = new File([blob], 'quiz-brasilbcn.png', { type: 'image/png' })

      if (canShareFiles([file])) {
        await navigator.share({ files: [file], title: shareText, text: shareText })
      } else if (navigator.share) {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl })
      } else {
        await downloadBlob(blob, 'quiz-brasilbcn.png')
        setDownloaded(true)
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') console.error('[ShareResult] instagram share failed:', e)
    } finally {
      setLoadingAction(null)
    }
  }

  function handleWhatsAppShare() {
    track('share_clicked')
    track('whatsapp_share_clicked')
  }

  async function handleCopyLink() {
    track('share_clicked')
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

  async function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }

  async function handleDownloadImage() {
    setLoadingAction('download')
    track('share_clicked')
    track('share_image_downloaded')
    try {
      const blob = await fetchShareImage(quizSlug, resultSlug, 'story')
      await downloadBlob(blob, 'quiz-brasilbcn.png')
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2500)
    } catch (e) {
      console.error('[ShareResult] download failed:', e)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <button
        type="button"
        onClick={handleInstagramShare}
        disabled={loadingAction === 'instagram'}
        className="flex items-center justify-center gap-2.5 w-full h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold text-[15px] transition-transform active:scale-[0.98] disabled:opacity-70"
      >
        {loadingAction === 'instagram' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
        Compartilhar no Instagram
      </button>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
        onClick={handleWhatsAppShare}
        className="flex items-center justify-center gap-2.5 w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[15px] transition-transform active:scale-[0.98]"
      >
        <MessageCircle className="w-5 h-5" />
        Compartilhar no WhatsApp
      </a>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-gray-100 text-gray-600 font-semibold text-sm transition-colors hover:bg-gray-50 active:scale-[0.98]"
        >
          {copied ? <Check className="w-4 h-4 text-[#009C3B]" /> : <LinkIcon className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar link'}
        </button>
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={loadingAction === 'download'}
          className="flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-gray-100 text-gray-600 font-semibold text-sm transition-colors hover:bg-gray-50 active:scale-[0.98] disabled:opacity-70"
        >
          {loadingAction === 'download' ? <Loader2 className="w-4 h-4 animate-spin" /> : downloaded ? <Check className="w-4 h-4 text-[#009C3B]" /> : <Download className="w-4 h-4" />}
          {downloaded ? 'Baixada!' : 'Baixar imagem'}
        </button>
      </div>
    </div>
  )
}
