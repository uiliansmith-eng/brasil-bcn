'use client'

const SESSION_KEY = 'bcn_quiz_session'

export function getQuizSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function getUtmParams() {
  if (typeof window === 'undefined') return { utm_source: null, utm_medium: null, utm_campaign: null }
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }
}

/** Best-effort traffic source detection. No PII — only used for aggregate viral-loop metrics. */
export function detectSource(): string {
  if (typeof window === 'undefined') return 'direct'

  const utmSource = getUtmParams().utm_source
  if (utmSource) return utmSource.toLowerCase()

  const ua = navigator.userAgent || ''
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/FBAN|FBAV/i.test(ua)) return 'facebook'
  if (/WhatsApp/i.test(ua)) return 'whatsapp'

  const ref = document.referrer
  if (ref) {
    if (/instagram\.com/i.test(ref)) return 'instagram'
    if (/facebook\.com|fb\.com/i.test(ref)) return 'facebook'
    if (/whatsapp\.com|wa\.me/i.test(ref)) return 'whatsapp'
    if (/google\./i.test(ref)) return 'google'
    return 'referral'
  }

  return 'direct'
}

/** Instagram's in-app browser has no reliable Web Share `files` support on some versions. */
export function isInstagramInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Instagram/i.test(navigator.userAgent || '')
}

export function canShareFiles(files: File[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false
  try {
    return navigator.canShare({ files })
  } catch {
    return false
  }
}
