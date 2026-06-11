'use client'

import { useState, useEffect } from 'react'
import { RouteStepCard } from './RouteStepCard'
import { RouteDecisionCards } from './RouteDecisionCards'
import type { Stage } from '@/actions/ruta'

interface Props {
  stages: Stage[]
}

export function AllStagesTimeline({ stages }: Props) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem('ruta_bcn_progress') || '[]')
    setCompletedSlugs(saved)
    setMounted(true)
  }, [])

  function toggleComplete(slug: string) {
    setCompletedSlugs(prev => {
      const updated = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
      localStorage.setItem('ruta_bcn_progress', JSON.stringify(updated))
      return updated
    })
  }

  const allSteps = stages.flatMap(s => s.steps ?? [])
  const totalSteps = allSteps.length
  const completedCount = mounted ? allSteps.filter(s => completedSlugs.includes(s.slug)).length : 0
  const firstIncompleteSlug = mounted ? allSteps.find(s => !completedSlugs.includes(s.slug))?.slug : undefined

  return (
    <div>
      {mounted && completedCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-bold text-gray-700">Tu progreso total</span>
            <span className="text-sm font-bold text-[#009C3B]">{completedCount}/{totalSteps} completados</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#009C3B] to-[#00c950] rounded-full transition-all duration-700"
              style={{ width: `${Math.round((completedCount / totalSteps) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{Math.round((completedCount / totalSteps) * 100)}% de la Ruta Brasileño completado</p>
        </div>
      )}

      <div className="space-y-14">
        {stages.map((stage) => {
          const steps = stage.steps ?? []
          const stageCompletedCount = mounted ? steps.filter(s => completedSlugs.includes(s.slug)).length : 0
          const stageFullyDone = mounted && stageCompletedCount === steps.length && steps.length > 0

          return (
            <div key={stage.id}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#002776]/8 border border-[#002776]/15 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-base leading-none">{stage.icon}</span>
                  <span className="text-[#002776] text-xs font-bold uppercase tracking-wider">
                    Etapa {stage.position} · {stage.title}
                  </span>
                  {stageFullyDone && (
                    <span className="text-[#009C3B] text-xs font-bold">✓ Completada</span>
                  )}
                </div>
                {stage.description && (
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{stage.description}</p>
                )}
              </div>

              <div>
                {steps.map((step, idx) => {
                  const isCompleted = completedSlugs.includes(step.slug)
                  const isNext = mounted && step.slug === firstIncompleteSlug
                  const isLast = idx === steps.length - 1

                  return (
                    <div key={step.id} className="flex gap-5">
                      <div className="flex flex-col items-center shrink-0 pt-5">
                        <StepBullet index={idx + 1} isCompleted={isCompleted} isNext={isNext} />
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 mt-2 min-h-10 ${isCompleted ? 'bg-[#009C3B]' : 'bg-gray-200'}`}
                          />
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${!isLast ? 'pb-6' : ''}`}>
                        <RouteStepCard
                          step={step}
                          isCompleted={isCompleted}
                          isNext={isNext && mounted}
                          onToggle={() => toggleComplete(step.slug)}
                        >
                          {step.slug === 'situacion-migratoria' && !isCompleted
                            ? <RouteDecisionCards />
                            : null}
                        </RouteStepCard>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepBullet({
  index,
  isCompleted,
  isNext,
}: {
  index: number
  isCompleted: boolean
  isNext: boolean
}) {
  if (isCompleted) {
    return (
      <div className="w-9 h-9 rounded-full bg-[#009C3B] flex items-center justify-center shadow-sm shrink-0">
        <span className="text-white text-sm font-bold">✓</span>
      </div>
    )
  }
  if (isNext) {
    return (
      <div className="relative w-9 h-9 shrink-0">
        <div className="absolute inset-0 rounded-full bg-[#002776]/30 animate-ping" />
        <div className="relative w-9 h-9 rounded-full bg-[#002776] flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">{index}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center shrink-0">
      <span className="text-gray-400 text-sm font-bold">{index}</span>
    </div>
  )
}
