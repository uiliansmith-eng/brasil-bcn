import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QuizCreateForm } from './QuizCreateForm'

export const metadata: Metadata = { title: 'Nuevo quiz — Admin' }

export default function NewQuizPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/quizzes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a quizzes
      </Link>
      <div>
        <h1 className="text-2xl font-black text-gray-900">Nuevo quiz</h1>
        <p className="text-gray-500 text-sm mt-1">Paso 1 de 3: información básica. Luego añadirás resultados y preguntas.</p>
      </div>
      <QuizCreateForm />
    </div>
  )
}
