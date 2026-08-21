import type { StoreAvailability } from '@/types'

const TIMEZONE = 'Europe/Madrid'

function nowInMadrid(): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')

  return { weekday: weekdayMap[weekdayStr] ?? 0, minutes: hour * 60 + minute }
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Devuelve null si la tienda no tiene horario estructurado cargado
// (no confundir con "cerrado" — simplemente no se puede calcular).
export function isStoreOpenNow(availability: StoreAvailability[]): boolean | null {
  if (availability.length === 0) return null

  const { weekday, minutes } = nowInMadrid()
  const today = availability.find((a) => a.weekday === weekday)
  if (!today || today.is_closed || !today.open_time || !today.close_time) return false

  const open = timeToMinutes(today.open_time)
  const close = timeToMinutes(today.close_time)
  return minutes >= open && minutes < close
}
