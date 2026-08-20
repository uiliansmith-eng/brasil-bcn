import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getResultBySlug } from '@/actions/quiz'
import { VerticalShareCard } from '@/lib/quiz-share-card'

const FORMATS = {
  story: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
} as const

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const quizSlug = searchParams.get('quiz')
  const resultSlug = searchParams.get('result')
  const formatParam = searchParams.get('format') ?? 'story'
  const format = (formatParam in FORMATS ? formatParam : 'story') as keyof typeof FORMATS

  if (!quizSlug || !resultSlug) {
    return new Response('Missing quiz/result params', { status: 400 })
  }

  const data = await getResultBySlug(quizSlug, resultSlug)
  if (!data) return new Response('Not found', { status: 404 })

  const dims = FORMATS[format]

  return new ImageResponse(
    <VerticalShareCard result={data.result} quizTitle={data.quiz.title} width={dims.width} height={dims.height} />,
    { ...dims }
  )
}
