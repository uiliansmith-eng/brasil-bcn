import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getQuizBySlug } from '@/actions/quiz'
import { buildMetadata } from '@/lib/seo'
import { QuizRunner } from '@/components/quiz/QuizRunner'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const quiz = await getQuizBySlug(slug)
  if (!quiz) return { title: 'Quiz não encontrado — Brasil BCN' }

  return buildMetadata({
    title: `${quiz.title} — Quiz da Semana | Brasil BCN`,
    description: quiz.description || `Faça o quiz e descubra seu resultado. ${quiz.questions.length} perguntas · ${quiz.estimated_minutes} min.`,
    path: `/quiz/${quiz.slug}`,
    image: quiz.cover_image ?? undefined,
    type: 'website',
    keywords: ['quiz brasileiro Barcelona', 'brasileiros em Barcelona', 'quiz Barcelona'],
  })
}

export default async function QuizTakePage({ params }: PageProps) {
  const { slug } = await params
  const quiz = await getQuizBySlug(slug)
  if (!quiz || quiz.questions.length === 0 || quiz.results.length === 0) notFound()

  return <QuizRunner quiz={quiz} />
}
