'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, Check } from 'lucide-react'
import { createQuestionAction, updateQuestionAction, deleteQuestionAction, moveQuestionAction, updateAnswerAction } from '@/actions/quiz'
import { cn } from '@/lib/utils'
import type { QuestionWithAnswers, QuizResult } from '@/types'

const LETTERS = ['A', 'B', 'C', 'D']

function AnswerRow({ quizId, answer, letter, results }: { quizId: string; answer: QuestionWithAnswers['answers'][0]; letter: string; results: QuizResult[] }) {
  const router = useRouter()
  const [text, setText] = useState(answer.answer)
  const [resultId, setResultId] = useState(answer.result_id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(nextText: string, nextResultId: string) {
    setSaving(true)
    const result = await updateAnswerAction(answer.id, quizId, { answer: nextText, result_id: nextResultId })
    setSaving(false)
    if ('ok' in result) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 1200)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-black flex items-center justify-center">{letter}</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => { if (text !== answer.answer) save(text, resultId) }}
        placeholder={`Respuesta ${letter}...`}
        className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
      />
      <select
        value={resultId}
        onChange={(e) => { setResultId(e.target.value); save(text, e.target.value) }}
        className="shrink-0 w-40 px-2 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
      >
        {results.map((r) => (
          <option key={r.id} value={r.id}>{r.icon} {r.title}</option>
        ))}
      </select>
      <span className="w-4 shrink-0">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" /> : saved ? <Check className="w-3.5 h-3.5 text-[#009C3B]" /> : null}
      </span>
    </div>
  )
}

function QuestionCard({ quizId, question, index, total, results }: { quizId: string; question: QuestionWithAnswers; index: number; total: number; results: QuizResult[] }) {
  const router = useRouter()
  const [text, setText] = useState(question.question)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [pending, setPending] = useState(false)

  async function saveQuestion() {
    if (text === question.question) return
    await updateQuestionAction(question.id, quizId, { question: text })
    router.refresh()
  }

  async function handleDelete() {
    if (!confirmingDelete) { setConfirmingDelete(true); return }
    const fd = new FormData()
    fd.set('id', question.id)
    fd.set('quizId', quizId)
    setPending(true)
    await deleteQuestionAction(fd)
    setPending(false)
    router.refresh()
  }

  async function move(direction: 'up' | 'down') {
    const fd = new FormData()
    fd.set('id', question.id)
    fd.set('quizId', quizId)
    fd.set('direction', direction)
    await moveQuestionAction(fd)
    router.refresh()
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs font-black text-gray-400 w-6">{index + 1}.</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={saveQuestion}
          rows={1}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
        />
        <div className="flex items-center shrink-0">
          <button type="button" onClick={() => move('up')} disabled={index === 0} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => move('down')} disabled={index === total - 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors ml-1', confirmingDelete ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-600 hover:bg-red-50')}
          >
            <Trash2 className="w-3.5 h-3.5" /> {confirmingDelete && '¿Confirmar?'}
          </button>
        </div>
      </div>

      <div className="pl-8 space-y-2">
        {question.answers.map((a, i) => (
          <AnswerRow key={a.id} quizId={quizId} answer={a} letter={LETTERS[i]} results={results} />
        ))}
      </div>
    </div>
  )
}

export function QuizQuestionsManager({ quizId, questions, results }: { quizId: string; questions: QuestionWithAnswers[]; results: QuizResult[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleAdd() {
    if (newQuestion.trim().length < 5) { setError('Mínimo 5 caracteres'); return }
    setPending(true)
    setError(null)
    const result = await createQuestionAction(quizId, { question: newQuestion.trim() })
    setPending(false)
    if ('error' in result) { setError(result.error); return }
    setNewQuestion('')
    setAdding(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-gray-900">Preguntas</h2>
        <span className="text-xs text-gray-400">{questions.length} pregunta{questions.length !== 1 ? 's' : ''}</span>
      </div>
      <p className="text-xs text-gray-400 -mt-2">Cada pregunta se crea con 4 respuestas (A–D) que puedes editar y asociar a un resultado.</p>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} quizId={quizId} question={q} index={i} total={questions.length} results={results} />
        ))}
      </div>

      {results.length === 0 ? (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">Crea al menos un resultado antes de añadir preguntas.</p>
      ) : adding ? (
        <div className="border-2 border-[#002776]/15 rounded-xl p-4 space-y-3 bg-[#002776]/[0.02]">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="É sábado e você não tem nenhum plano. O que você faz?"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
          />
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd} disabled={pending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002776] text-white text-xs font-semibold disabled:opacity-60">
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Crear pregunta
            </button>
            <button type="button" onClick={() => { setAdding(false); setError(null) }} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">Cancelar</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#002776] hover:bg-[#002776]/5 px-3 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Añadir pregunta
        </button>
      )}
    </div>
  )
}
