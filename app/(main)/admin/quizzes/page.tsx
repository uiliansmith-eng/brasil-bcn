import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Plus, HelpCircle, Award } from 'lucide-react'
import { getAdminQuizzes, publishQuizAction, setQuizOfWeekAction, duplicateQuizAction, deleteQuizAction } from '@/actions/quiz'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Quizzes — Admin' }

export default async function AdminQuizzesPage() {
  const quizzes = await getAdminQuizzes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quiz da Semana</h1>
          <p className="text-gray-500 text-sm mt-1">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} · motor reutilizable de quizzes virales</p>
        </div>
        <Link href="/admin/quizzes/nueva">
          <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
            <Plus className="w-4 h-4" /> Nuevo quiz
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Sin quizzes</p>
          <p className="text-gray-400 text-sm mb-6">Crea el primer Quiz da Semana</p>
          <Link href="/admin/quizzes/nueva">
            <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
              <Plus className="w-4 h-4" /> Nuevo quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {quizzes.map((quiz) => {
            const questionCount = (quiz.questions as unknown as { count: number }[])?.[0]?.count ?? 0
            const resultCount = (quiz.results as unknown as { count: number }[])?.[0]?.count ?? 0
            const isPublished = quiz.status === 'published'
            return (
              <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPublished ? 'bg-[#009C3B]/10' : 'bg-gray-100'}`}>
                  <Sparkles className={`w-5 h-5 ${isPublished ? 'text-[#009C3B]' : 'text-gray-400'}`} />
                </div>

                <Link href={`/admin/quizzes/${quiz.id}`} className="flex-1 min-w-0 group">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-[#002776] transition-colors">{quiz.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {isPublished ? 'Publicado' : 'Borrador'}
                    </span>
                    {quiz.is_quiz_of_week && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFDF00]/20 text-[#7a6600] shrink-0">
                        <Award className="w-3 h-3" /> Quiz da semana
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" />{questionCount} preguntas</span>
                    <span>{resultCount} resultados</span>
                  </p>
                </Link>

                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {isPublished && (
                    <Link href={`/quiz/${quiz.slug}`} target="_blank">
                      <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                        Ver
                      </button>
                    </Link>
                  )}

                  {isPublished && !quiz.is_quiz_of_week && (
                    <form action={setQuizOfWeekAction}>
                      <input type="hidden" name="id" value={quiz.id} />
                      <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-[#FFDF00]/20 hover:bg-[#FFDF00]/30 text-[#7a6600] rounded-lg transition-colors">
                        Marcar da semana
                      </button>
                    </form>
                  )}

                  <form action={publishQuizAction}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <input type="hidden" name="publish" value={String(!isPublished)} />
                    <button type="submit" className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${isPublished ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#002776] hover:bg-[#001a5c] text-white'}`}>
                      {isPublished ? 'Despublicar' : 'Publicar'}
                    </button>
                  </form>

                  <form action={duplicateQuizAction}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
                      Duplicar
                    </button>
                  </form>

                  <form action={deleteQuizAction}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
