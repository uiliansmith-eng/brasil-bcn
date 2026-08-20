import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'
import { getQuizForAdmin, publishQuizAction, setQuizOfWeekAction, getQuizAnalytics } from '@/actions/quiz'
import { QuizMetaForm } from '@/components/admin/quiz/QuizMetaForm'
import { QuizResultsManager } from '@/components/admin/quiz/QuizResultsManager'
import { QuizQuestionsManager } from '@/components/admin/quiz/QuizQuestionsManager'
import { QuizAnalyticsPanel } from '@/components/admin/quiz/QuizAnalyticsPanel'

export const metadata: Metadata = { title: 'Editar quiz — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminQuizBuilderPage({ params }: PageProps) {
  const { id } = await params
  const quiz = await getQuizForAdmin(id)
  if (!quiz) notFound()

  const isPublished = quiz.status === 'published'
  const readyToPublish = quiz.questions.length > 0 && quiz.results.length > 0 && quiz.questions.every((q) => q.answers.every((a) => a.answer.trim().length > 0))
  const analytics = await getQuizAnalytics(quiz.id)

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/quizzes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a quizzes
      </Link>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
            {quiz.title}
            {quiz.is_quiz_of_week && (
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFDF00]/20 text-[#7a6600]">
                <Award className="w-3 h-3" /> Quiz da semana
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {quiz.questions.length} preguntas · {quiz.results.length} resultados · {isPublished ? 'Publicado' : 'Borrador'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPublished && (
            <Link href={`/quiz/${quiz.slug}`} target="_blank">
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                Ver / Preview
              </button>
            </Link>
          )}
          {isPublished && !quiz.is_quiz_of_week && (
            <form action={setQuizOfWeekAction}>
              <input type="hidden" name="id" value={quiz.id} />
              <button type="submit" className="px-4 py-2 text-sm font-semibold bg-[#FFDF00]/20 hover:bg-[#FFDF00]/30 text-[#7a6600] rounded-lg transition-colors">
                Marcar quiz da semana
              </button>
            </form>
          )}
          <form action={publishQuizAction}>
            <input type="hidden" name="id" value={quiz.id} />
            <input type="hidden" name="publish" value={String(!isPublished)} />
            <button
              type="submit"
              disabled={!isPublished && !readyToPublish}
              title={!isPublished && !readyToPublish ? 'Añade resultados, preguntas y completa todas las respuestas primero' : undefined}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#009C3B] hover:bg-[#007a2f] text-white data-[published=true]:bg-gray-100"
            >
              {isPublished ? 'Despublicar' : 'Publicar'}
            </button>
          </form>
        </div>
      </div>

      {!isPublished && !readyToPublish && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Para publicar necesitas: al menos 1 resultado, al menos 1 pregunta, y las 4 respuestas de cada pregunta con texto.
        </div>
      )}

      {analytics && <QuizAnalyticsPanel analytics={analytics} results={quiz.results} />}
      <QuizMetaForm quiz={quiz} />
      <QuizResultsManager quizId={quiz.id} results={quiz.results} />
      <QuizQuestionsManager quizId={quiz.id} questions={quiz.questions} results={quiz.results} />
    </div>
  )
}
