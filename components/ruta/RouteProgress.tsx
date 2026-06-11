'use client'

interface Props {
  completed: number
  total: number
}

export function RouteProgress({ completed, total }: Props) {
  if (completed === 0) return null
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-bold text-gray-700">Tu progreso</span>
        <span className="text-sm font-bold text-[#009C3B]">{completed}/{total} completados</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#009C3B] to-[#00c950] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{pct}% de la Etapa 1 completado</p>
    </div>
  )
}
