import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getResultBySlug } from '@/actions/quiz'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/config'
import { ResultScreen } from '@/components/quiz/ResultScreen'

interface PageProps {
  params: Promise<{ slug: string; resultSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, resultSlug } = await params
  const data = await getResultBySlug(slug, resultSlug)
  if (!data) return { title: 'Resultado não encontrado — Brasil BCN' }

  const { quiz, result } = data
  return buildMetadata({
    title: `Eu sou ${result.title}! ${result.icon ?? '🇧🇷'}`,
    description: `Descubra que tipo de brasileiro você é em Barcelona no Quiz da Semana do Brasil BCN. ${quiz.title}`,
    path: `/quiz/${slug}/resultado/${resultSlug}`,
    type: 'article',
    keywords: ['quiz brasileiro Barcelona', 'brasileiro em Barcelona', result.title],
  })
}

export default async function QuizResultPage({ params }: PageProps) {
  const { slug, resultSlug } = await params
  const data = await getResultBySlug(slug, resultSlug)
  if (!data) notFound()

  const { quiz, result } = data
  const shareUrl = `${siteConfig.url}/quiz/${slug}/resultado/${resultSlug}`

  return <ResultScreen quiz={{ id: quiz.id, slug: quiz.slug, title: quiz.title }} result={result} shareUrl={shareUrl} />
}
