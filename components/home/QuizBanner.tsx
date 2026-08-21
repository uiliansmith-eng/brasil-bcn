import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { getQuizOfWeek } from '@/actions/quiz'

export async function QuizBanner() {
  const quiz = await getQuizOfWeek()
  if (!quiz) return null

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#002776] via-[#00195a] to-[#001033] py-10 sm:py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#009C3B]/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-[#FFDF00]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#009C3B] flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#7a6600] bg-[#FFDF00] px-3 py-1 rounded-full mb-2.5">
              ✨ QUIZ DA SEMANA 🇧🇷
            </span>
            <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-1.5 text-balance">
              {quiz.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg font-medium">
              {quiz.description || 'Descubra qual é o seu perfil e compartilhe o resultado no Instagram.'}
            </p>
          </div>

          <Link
            href={`/quiz/${quiz.slug}`}
            className="shrink-0 inline-flex items-center gap-2 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
          >
            Fazer o quiz
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
