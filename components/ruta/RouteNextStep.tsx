'use client'

import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import type { Step } from '@/actions/ruta'

interface Props {
  steps: Step[]
  completedSlugs: string[]
}

export function RouteNextStep({ steps, completedSlugs }: Props) {
  const allDone = steps.length > 0 && steps.every(s => completedSlugs.includes(s.slug))
  const nextStep = steps.find(s => !completedSlugs.includes(s.slug))

  if (allDone) {
    return (
      <div className="bg-gradient-to-br from-[#009C3B] to-[#00c950] rounded-2xl p-6 text-center text-white">
        <Trophy className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h3 className="text-xl font-black mb-1">¡Etapa 1 completada!</h3>
        <p className="text-green-100 text-sm max-w-xs mx-auto">
          Has completado todos los pasos esenciales de tu primera semana en Barcelona. ¡Felicidades!
        </p>
      </div>
    )
  }

  if (!nextStep) return null

  return (
    <div className="bg-[#002776] rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
        {nextStep.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">Tu próximo paso</p>
        <h3 className="font-black text-white text-base leading-tight">{nextStep.title}</h3>
        {nextStep.short_description && (
          <p className="text-blue-200 text-sm mt-0.5 leading-relaxed line-clamp-2">{nextStep.short_description}</p>
        )}
      </div>
      <Link
        href={`/ruta-brasileno/${nextStep.slug}`}
        className="shrink-0 flex items-center gap-1.5 bg-white text-[#002776] text-sm font-bold px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
      >
        Empezar <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
