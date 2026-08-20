import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getQuizOfWeek } from '@/actions/quiz'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Quiz da Semana — Brasil BCN',
  description: 'Faça o quiz da semana e descubra seu perfil de brasileiro em Barcelona. Compartilhe seu resultado no Instagram!',
  path: '/quiz',
  keywords: ['quiz brasileiro Barcelona', 'brasileiro em Barcelona', 'quiz Barcelona', 'comunidade brasileira Barcelona'],
})

export default async function QuizLandingPage() {
  const quiz = await getQuizOfWeek()

  if (!quiz) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="text-5xl mb-4">🇧🇷</span>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Nenhum quiz ativo no momento</h1>
        <p className="text-gray-500 text-sm max-w-xs">Volte em breve — toda semana tem um Quiz da Semana novo no Brasil BCN.</p>
      </div>
    )
  }

  redirect(`/quiz/${quiz.slug}`)
}
