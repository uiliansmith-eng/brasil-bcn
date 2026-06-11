'use client'

import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { Step } from '@/actions/ruta'

interface Props {
  step: Step
  isCompleted: boolean
  isNext: boolean
  onToggle: () => void
  children?: React.ReactNode
}

export function RouteStepCard({ step, isCompleted, isNext, onToggle, children }: Props) {
  return (
    <div
      className={`
        rounded-2xl border p-5 transition-all duration-300
        ${isCompleted
          ? 'bg-green-50/50 border-green-200'
          : isNext
          ? 'bg-white border-[#002776]/30 shadow-lg shadow-blue-100/60'
          : 'bg-white border-gray-200'}
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5 shrink-0">{step.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-black text-base leading-tight ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {step.title}
          </h3>
          {step.short_description && !isCompleted && (
            <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{step.short_description}</p>
          )}
          {step.estimated_time && !isCompleted && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{step.estimated_time}</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
          className={`
            shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all mt-0.5
            ${isCompleted
              ? 'bg-[#009C3B] border-[#009C3B]'
              : 'border-gray-300 hover:border-[#009C3B] hover:bg-green-50'}
          `}
        >
          {isCompleted && <span className="text-white text-xs font-bold">✓</span>}
        </button>
      </div>

      {!isCompleted && (
        <div className="mt-4">
          <Link
            href={`/ruta-brasileno/${step.slug}`}
            className={`
              inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all
              ${isNext
                ? 'bg-[#002776] text-white hover:bg-[#001a5c]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            Ver guía completa <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {children && (
        <div className="mt-5 pt-5 border-t border-gray-100">{children}</div>
      )}
    </div>
  )
}
