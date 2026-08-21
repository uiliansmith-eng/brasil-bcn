'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getStoreAvailability, setStoreAvailabilityAction } from '@/actions/reservations'
import { WEEKDAY_LABELS } from '@/lib/constants'
import type { AvailabilityDayInput } from '@/lib/validations/reservations'
import type { StoreAvailability } from '@/types'

interface StoreAvailabilityManagerProps {
  companyId: string
}

function defaultDays(): AvailabilityDayInput[] {
  return Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    is_closed: weekday === 0,
    open_time: '09:00',
    close_time: '20:00',
  }))
}

export function StoreAvailabilityManager({ companyId }: StoreAvailabilityManagerProps) {
  const [days, setDays] = useState<AvailabilityDayInput[]>(defaultDays())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getStoreAvailability(companyId).then((data) => {
      const existing = data as StoreAvailability[]
      if (existing.length > 0) {
        setDays(defaultDays().map((d) => {
          const found = existing.find((e) => e.weekday === d.weekday)
          return found ? {
            weekday: found.weekday,
            is_closed: found.is_closed,
            open_time: found.open_time ?? '09:00',
            close_time: found.close_time ?? '20:00',
          } : d
        }))
      }
      setLoading(false)
    })
  }, [companyId])

  const updateDay = (weekday: number, patch: Partial<AvailabilityDayInput>) => {
    setDays((prev) => prev.map((d) => d.weekday === weekday ? { ...d, ...patch } : d))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await setStoreAvailabilityAction(companyId, days)
    setSaving(false)
    if ('ok' in result) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 flex items-center justify-center h-24">
        <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="font-black text-gray-900 text-lg mb-1">Horario de reservas</h2>
      <p className="text-gray-400 text-sm mb-5">Define cuándo se pueden reservar tus servicios.</p>

      <div className="space-y-2">
        {days.map((day) => (
          <div key={day.weekday} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm font-medium text-gray-700 w-24 shrink-0">{WEEKDAY_LABELS[day.weekday]}</span>
            <div className="flex items-center gap-2 shrink-0">
              <Checkbox
                id={`closed-${day.weekday}`}
                checked={!day.is_closed}
                onCheckedChange={(v) => updateDay(day.weekday, { is_closed: v !== true })}
              />
              <label htmlFor={`closed-${day.weekday}`} className="text-xs text-gray-500 cursor-pointer">Abierto</label>
            </div>
            {!day.is_closed && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={day.open_time ?? ''}
                  onChange={(e) => updateDay(day.weekday, { open_time: e.target.value })}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                />
                <span className="text-gray-300">–</span>
                <input
                  type="time"
                  value={day.close_time ?? ''}
                  onChange={(e) => updateDay(day.weekday, { close_time: e.target.value })}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1.5"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 h-10 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold gap-2"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saved ? 'Guardado' : 'Guardar horario'}
      </Button>
    </div>
  )
}
