'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Stage } from '@/actions/ruta'

const DIFFICULTY_LABELS = { facil: 'Fácil', medio: 'Medio', dificil: 'Avanzado' }
const DIFFICULTY_COLORS = {
  facil:   'bg-green-50 text-green-700 border-green-200',
  medio:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  dificil: 'bg-red-50 text-red-700 border-red-200',
}

interface Props {
  stages: Stage[]
}

export function RutaTimeline({ stages }: Props) {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-0 min-h-[600px]">

      {/* ── Sidebar: stage list ── */}
      <aside className="bg-white border-r border-gray-100 rounded-l-2xl overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tu ruta</p>
        </div>
        <nav className="p-2">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(i)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group',
                activeStage === i
                  ? 'bg-[#002776] text-white shadow-sm'
                  : 'hover:bg-gray-50 text-gray-700'
              )}
            >
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p className={cn(
                  'text-xs font-medium mb-0.5',
                  activeStage === i ? 'text-blue-200' : 'text-gray-400'
                )}>
                  Etapa {s.position}
                </p>
                <p className={cn(
                  'text-sm font-semibold truncate',
                  activeStage === i ? 'text-white' : 'text-gray-800'
                )}>
                  {s.title}
                </p>
              </div>
              <ChevronRight className={cn(
                'w-4 h-4 ml-auto shrink-0 transition-transform',
                activeStage === i ? 'text-blue-300 translate-x-0.5' : 'text-gray-300 group-hover:text-gray-400'
              )} />
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main: stage detail ── */}
      <div className="bg-white rounded-r-2xl overflow-hidden">
        {stage && (
          <>
            {/* Stage header */}
            <div
              className="px-8 py-6 border-b border-gray-100"
              style={{ borderLeft: `4px solid ${stage.color}` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${stage.color}15` }}
                >
                  {stage.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Etapa {stage.position} de {stages.length}
                  </p>
                  <h2 className="text-xl font-black text-gray-900">{stage.title}</h2>
                  {stage.description && (
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{stage.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="p-6">
              {!stage.steps || stage.steps.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Próximamente</p>
              ) : (
                <div className="space-y-3">
                  {stage.steps.map((step, idx) => (
                    <Link
                      key={step.id}
                      href={`/ruta-brasileno/${step.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#002776]/20 hover:bg-blue-50/30 transition-all duration-200"
                    >
                      {/* Step number */}
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#002776] flex items-center justify-center shrink-0 transition-colors">
                        <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                          {(activeStage * 4) + idx + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{step.icon}</span>
                          <span className="font-semibold text-gray-900 text-sm group-hover:text-[#002776] transition-colors">
                            {step.title}
                          </span>
                          {step.difficulty && (
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full border font-medium hidden sm:inline-flex',
                              DIFFICULTY_COLORS[step.difficulty]
                            )}>
                              {DIFFICULTY_LABELS[step.difficulty]}
                            </span>
                          )}
                        </div>
                        {step.short_description && (
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                            {step.short_description}
                          </p>
                        )}
                        {step.estimated_time && (
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{step.estimated_time}</span>
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#002776] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Navigate stages */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                  disabled={activeStage === 0}
                  className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  ← Etapa anterior
                </button>
                <div className="flex gap-1.5">
                  {stages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStage(i)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        i === activeStage ? 'bg-[#002776] w-6' : 'bg-gray-200 hover:bg-gray-300'
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
                  disabled={activeStage === stages.length - 1}
                  className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  Siguiente etapa →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
