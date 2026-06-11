import { CheckCircle2, Circle, Dot } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Stage } from '@/actions/ruta'

interface Props {
  stages: Stage[]
  activeSlug?: string
}

export function RutaProgressBar({ stages, activeSlug }: Props) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-hide">
      {stages.map((stage, i) => {
        const isActive = stage.slug === activeSlug
        const isFirst = i === 0
        const isLast = i === stages.length - 1
        return (
          <div key={stage.id} className="flex items-center shrink-0">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              isActive
                ? 'bg-[#002776] text-white'
                : 'bg-gray-100 text-gray-500'
            )}>
              <span>{stage.icon}</span>
              <span className="hidden sm:inline">{stage.title}</span>
            </div>
            {!isLast && (
              <div className="w-8 h-px bg-gray-200 shrink-0 mx-1" />
            )}
          </div>
        )
      })}
    </div>
  )
}
