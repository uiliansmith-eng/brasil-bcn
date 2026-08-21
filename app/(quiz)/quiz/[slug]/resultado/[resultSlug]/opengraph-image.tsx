import { ImageResponse } from 'next/og'
import { getResultBySlug } from '@/actions/quiz'
import { HorizontalShareCard } from '@/lib/quiz-share-card'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Resultado do Quiz da Semana — Brasil BCN'

interface Props {
  params: Promise<{ slug: string; resultSlug: string }>
}

export default async function Image({ params }: Props) {
  const { slug, resultSlug } = await params
  const data = await getResultBySlug(slug, resultSlug)

  return new ImageResponse(
    data ? (
      <HorizontalShareCard result={data.result} quizTitle={data.quiz.title} />
    ) : (
      <div style={{ display: 'flex', width: 1200, height: 630, backgroundColor: '#002776', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: 'white', fontFamily: 'sans-serif' }}>
        Brasil BCN — Quiz da Semana
      </div>
    ),
    { ...size, emoji: 'twemoji' }
  )
}
