'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { logQuizEvent } from '@/actions/quiz'
import { computeQuizResult } from '@/lib/quiz-scoring'
import { getQuizSessionId, detectSource, getUtmParams } from '@/lib/quiz-client'
import { cn } from '@/lib/utils'
import type { QuizWithContent } from '@/types'

const LETTERS = ['A', 'B', 'C', 'D']

export function QuizRunner({ quiz }: { quiz: QuizWithContent }) {
  const router = useRouter()
  const [stage, setStage] = useState<'intro' | 'question'>('intro')
  const [index, setIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const viewedLogged = useRef(false)

  useEffect(() => {
    if (viewedLogged.current) return
    viewedLogged.current = true
    const { utm_source, utm_medium, utm_campaign } = getUtmParams()
    logQuizEvent({
      quizId: quiz.id,
      sessionId: getQuizSessionId(),
      eventType: 'quiz_viewed',
      source: detectSource(),
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const question = quiz.questions[index]
  const isLast = index === quiz.questions.length - 1

  function handleStart() {
    logQuizEvent({ quizId: quiz.id, sessionId: getQuizSessionId(), eventType: 'quiz_started', source: detectSource() })
    setStage('question')
  }

  function handleSelect(answerId: string, resultId: string) {
    if (selectedAnswerId) return
    setSelectedAnswerId(answerId)

    const nextSelections = { ...selections, [question.id]: resultId }
    setSelections(nextSelections)

    logQuizEvent({
      quizId: quiz.id,
      sessionId: getQuizSessionId(),
      eventType: 'question_answered',
      questionId: question.id,
      source: detectSource(),
      meta: { answer_id: answerId, order: index + 1 },
    })

    setTimeout(() => {
      if (isLast) {
        const resultsById = Object.fromEntries(quiz.results.map((r) => [r.id, { order_index: r.order_index }]))
        const winningResultId = computeQuizResult(
          quiz.questions.map((q) => ({ questionId: q.id, resultId: nextSelections[q.id] })),
          resultsById
        )
        const winningResult = quiz.results.find((r) => r.id === winningResultId)!

        logQuizEvent({
          quizId: quiz.id,
          sessionId: getQuizSessionId(),
          eventType: 'quiz_completed',
          resultId: winningResultId,
          source: detectSource(),
        })

        try {
          sessionStorage.setItem(`bcn_quiz_just_completed_${winningResult.slug}`, Date.now().toString())
        } catch {}

        router.push(`/quiz/${quiz.slug}/resultado/${winningResult.slug}`)
      } else {
        setIndex((i) => i + 1)
        setSelectedAnswerId(null)
      }
    }, 280)
  }

  function handleBack() {
    if (index === 0) return
    setSelectedAnswerId(null)
    setIndex((i) => i - 1)
  }

  if (stage === 'intro') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-md mx-auto w-full relative overflow-hidden">
        <div className="absolute -top-10 -right-16 w-56 h-56 rounded-full bg-[#009C3B]/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-24 -left-20 w-56 h-56 rounded-full bg-[#FFDF00]/15 blur-2xl pointer-events-none" />

        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#009C3B]/10 to-[#FFDF00]/10 flex items-center justify-center mb-5">
          <span className="text-5xl">🇧🇷</span>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#7a6600] bg-[#FFDF00] px-3.5 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" /> QUIZ DA SEMANA
        </p>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 text-balance">
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="text-gray-500 text-base leading-relaxed mb-6 text-balance">{quiz.description}</p>
        )}
        <p className="text-sm font-semibold text-gray-400 mb-10">
          {quiz.questions.length} perguntas · {quiz.estimated_minutes} min
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="w-full h-16 rounded-2xl bg-[#009C3B] hover:bg-[#007a2f] active:scale-[0.98] text-white font-black text-lg tracking-wide transition-all shadow-lg shadow-[#009C3B]/20"
        >
          COMEÇAR O QUIZ
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-5 pb-8 max-w-md mx-auto w-full">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={index === 0}
          aria-label="Pergunta anterior"
          className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors', index === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:bg-gray-100')}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#009C3B] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-bold text-gray-400 tabular-nums">
          {index + 1}/{quiz.questions.length}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-black text-gray-900 leading-tight mb-8 text-balance">
        {question.question}
      </h2>

      {/* Answers */}
      <div className="flex flex-col gap-3">
        {question.answers.map((answer, i) => {
          const isSelected = selectedAnswerId === answer.id
          return (
            <button
              key={answer.id}
              type="button"
              onClick={() => handleSelect(answer.id, answer.result_id)}
              disabled={!!selectedAnswerId}
              className={cn(
                'flex items-start gap-3 text-left w-full min-h-[4rem] px-4 py-4 rounded-2xl border-2 transition-all active:scale-[0.98]',
                isSelected
                  ? 'border-[#009C3B] bg-[#009C3B]/5'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
              )}
            >
              <span className={cn(
                'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mt-0.5',
                isSelected ? 'bg-[#009C3B] text-white' : 'bg-white text-gray-400 border border-gray-200'
              )}>
                {LETTERS[i]}
              </span>
              <span className="text-[15px] font-medium text-gray-800 leading-snug pt-0.5">{answer.answer}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
