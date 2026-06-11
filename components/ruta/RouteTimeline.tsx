'use client'

import { useState, useEffect } from 'react'
import { RouteStepCard } from './RouteStepCard'
import { RouteProgress } from './RouteProgress'
import { RouteDecisionCards } from './RouteDecisionCards'
import { RouteNextStep } from './RouteNextStep'
import type { Step } from '@/actions/ruta'

interface Props {
  steps: Step[]
}

export function RouteTimeline({ steps }: Props) {
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

  const nextIdx = steps.findIndex(s => !completedSlugs.includes(s.slug))

  return (
    <div>
      {mounted && (
        <RouteProgress completed={completedSlugs.length} total={steps.length} />
      )}

      <div>
        {steps.map((step, idx) => {
          const isCompleted = completedSlugs.includes(step.slug)
          const isNext = mounted && idx === nextIdx
          const isLast = idx === steps.length - 1

          return (
            <div key={step.id} className="flex gap-5">
              {/* Timeline column */}
              <div className="flex flex-col items-center shrink-0 pt-5">
                <StepBullet index={idx + 1} isCompleted={isCompleted} isNext={isNext} />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 mt-2 min-h-10 ${
                      isCompleted ? 'bg-[#009C3B]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Step card */}
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

      {mounted && (
        <div className="mt-8">
          <RouteNextStep steps={steps} completedSlugs={completedSlugs} />
        </div>
      )}
    </div>
  )
}

function StepBullet({
  index, isCompleted, isNext,
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
