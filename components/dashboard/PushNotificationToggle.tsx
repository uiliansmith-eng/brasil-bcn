'use client'

import { useEffect, useState } from 'react'
import { Bell, BellRing, Loader2 } from 'lucide-react'
import { savePushSubscriptionAction, deletePushSubscriptionAction } from '@/actions/push'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

type Status = 'checking' | 'unsupported' | 'denied' | 'off' | 'on'

export function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>('checking')
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      const sub = await reg?.pushManager.getSubscription()
      setStatus(sub ? 'on' : 'off')
    })
  }, [])

  const enable = async () => {
    setIsPending(true)
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) return

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'denied' : 'off')
        return
      }

      const reg = await navigator.serviceWorker.register('/sw.js')
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const json = sub.toJSON()
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return

      const result = await savePushSubscriptionAction({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      })
      setStatus('error' in result ? 'off' : 'on')
    } finally {
      setIsPending(false)
    }
  }

  const disable = async () => {
    setIsPending(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      if (sub) {
        await deletePushSubscriptionAction(sub.endpoint)
        await sub.unsubscribe()
      }
      setStatus('off')
    } finally {
      setIsPending(false)
    }
  }

  if (status === 'checking' || status === 'unsupported') return null

  if (status === 'denied') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Bell className="w-3.5 h-3.5" /> Notificaciones bloqueadas en el navegador
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={status === 'on' ? disable : enable}
      className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f] disabled:opacity-60"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : status === 'on' ? (
        <BellRing className="w-3.5 h-3.5" />
      ) : (
        <Bell className="w-3.5 h-3.5" />
      )}
      {status === 'on' ? 'Notificaciones activadas' : 'Activar notificaciones'}
    </button>
  )
}
