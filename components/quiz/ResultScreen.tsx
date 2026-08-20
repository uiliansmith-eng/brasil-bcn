'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { logQuizEvent } from '@/actions/quiz'
import { getQuizSessionId, detectSource } from '@/lib/quiz-client'
import { ShareResult } from './ShareResult'
import type { QuizResult } from '@/types'

interface ResultScreenProps {
  quiz: { id: string; slug: string; title: string }
  result: QuizResult
  shareUrl: string
}

export function ResultScreen({ quiz, result, shareUrl }: ResultScreenProps) {
  const [justCompleted, setJustCompleted] = useState(false)
  const viewedLogged = useRef(false)

  useEffect(() => {
    try {
      const key = `bcn_quiz_just_completed_${result.slug}`
      if (sessionStorage.getItem(key)) {
        setJustCompleted(true)
        sessionStorage.removeItem(key)
      }
    } catch {}

    if (viewedLogged.current) return
    viewedLogged.current = true
    logQuizEvent({
      quizId: quiz.id,
      sessionId: getQuizSessionId(),
      eventType: 'result_viewed',
      resultId: result.id,
      source: detectSource(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-14 max-w-md mx-auto w-full text-center">
      <span className="text-6xl mb-5">{result.icon ?? '🇧🇷'}</span>
      <p className="text-xs font-bold tracking-widest text-[#009C3B] mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" /> {justCompleted ? 'SEU RESULTADO' : `RESULTADO DE ${quiz.title.toUpperCase()}`}
      </p>
      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 text-balance">
        {result.title}
      </h1>
      {result.subtitle && (
        <p className="text-gray-500 text-lg leading-relaxed mb-6 text-balance italic">&ldquo;{result.subtitle}&rdquo;</p>
      )}
      {result.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6 text-balance">{result.description}</p>
      )}
      {result.ideal_role && (
        <div className="w-full bg-[#009C3B]/5 border border-[#009C3B]/15 rounded-2xl px-5 py-4 mb-8">
          <p className="text-xs font-bold text-[#009C3B] mb-1 tracking-wide">SEU ROLÊ IDEAL</p>
          <p className="text-gray-700 text-sm font-medium">{result.ideal_role}</p>
        </div>
      )}

      <div className="w-full mb-8">
        <p className="text-sm font-bold text-gray-400 mb-3">Compartilhe seu resultado</p>
        <ShareResult
          quizId={quiz.id}
          quizSlug={quiz.slug}
          resultId={result.id}
          resultSlug={result.slug}
          resultTitle={result.title}
          shareUrl={shareUrl}
        />
      </div>

      {!justCompleted && (
        <Link
          href={`/quiz/${quiz.slug}`}
          className="w-full h-14 flex items-center justify-center rounded-2xl bg-[#002776] hover:bg-[#001a5c] active:scale-[0.98] text-white font-black text-base tracking-wide transition-all"
        >
          E você? FAÇA O QUIZ
        </Link>
      )}
    </div>
  )
}
