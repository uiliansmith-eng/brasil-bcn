import { BarChart3 } from 'lucide-react'
import type { QuizResult } from '@/types'

interface Analytics {
  views: number
  starts: number
  completions: number
  startRate: number
  completionRate: number
  shareClicks: number
  instagramShares: number
  whatsappShares: number
  imageDownloads: number
  instagramViews: number
  byResult: Record<string, { completions: number; shares: number }>
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-lg font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export function QuizAnalyticsPanel({ analytics, results }: { analytics: Analytics; results: QuizResult[] }) {
  const pct = (n: number) => `${Math.round(n * 100)}%`
  const mostPopular = results
    .map((r) => ({ r, c: analytics.byResult[r.id]?.completions ?? 0 }))
    .sort((a, b) => b.c - a.c)[0]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-gray-400" />
        <h2 className="font-black text-gray-900">Analytics</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="Visitas" value={analytics.views} />
        <Stat label="Empezaron" value={`${analytics.starts} (${pct(analytics.startRate)})`} />
        <Stat label="Completaron" value={`${analytics.completions} (${pct(analytics.completionRate)})`} />
        <Stat label="Shares" value={analytics.shareClicks} />
        <Stat label="Share Instagram" value={analytics.instagramShares} />
        <Stat label="Share WhatsApp" value={analytics.whatsappShares} />
        <Stat label="Imágenes bajadas" value={analytics.imageDownloads} />
        <Stat label="Visitas desde Instagram (viral loop)" value={analytics.instagramViews} />
      </div>

      {results.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Resultados más obtenidos</p>
          <div className="space-y-1.5">
            {results.map((r) => {
              const data = analytics.byResult[r.id] ?? { completions: 0, shares: 0 }
              const isTop = mostPopular?.r.id === r.id && data.completions > 0
              return (
                <div key={r.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    {r.icon} {r.title} {isTop && <span className="text-[10px] font-bold text-[#009C3B]">MAIS POPULAR</span>}
                  </span>
                  <span className="text-xs text-gray-400 tabular-nums">{data.completions} resultados · {data.shares} shares</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        &ldquo;Visitas desde Instagram&rdquo; se aproxima por UTM/referrer/user-agent — no es atribución perfecta de qué visita vino exactamente de qué compartido, pero mide el volumen del loop viral.
      </p>
    </div>
  )
}
