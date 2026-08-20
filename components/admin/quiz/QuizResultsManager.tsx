'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'
import { createResultAction, updateResultAction, deleteResultAction } from '@/actions/quiz'
import { quizResultSchema } from '@/lib/validations/quiz'
import { cn } from '@/lib/utils'
import type { QuizResult } from '@/types'

interface FormState {
  title: string
  icon: string
  subtitle: string
  description: string
  ideal_role: string
}

const EMPTY: FormState = { title: '', icon: '', subtitle: '', description: '', ideal_role: '' }

function ResultForm({ initial, onCancel, onSubmit, pending }: { initial: FormState; onCancel: () => void; onSubmit: (v: FormState) => void; pending: boolean }) {
  const [values, setValues] = useState<FormState>(initial)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setValues((s) => ({ ...s, [k]: v }))
  }

  function handleSubmit() {
    const parsed = quizResultSchema.safeParse(values)
    if (!parsed.success) { setError(parsed.error.issues[0].message); return }
    setError(null)
    onSubmit(values)
  }

  return (
    <div className="border-2 border-[#002776]/15 rounded-xl p-4 space-y-3 bg-[#002776]/[0.02]">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <input value={values.icon} onChange={(e) => set('icon', e.target.value)} placeholder="🇧🇷" className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-center" />
        <input value={values.title} onChange={(e) => set('title', e.target.value)} placeholder="Brasileiro Raiz" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      </div>
      <input value={values.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Frase / tagline para compartir" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      <textarea value={values.description} onChange={(e) => set('description', e.target.value)} placeholder="Descripción del resultado" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
      <input value={values.ideal_role} onChange={(e) => set('ideal_role', e.target.value)} placeholder="Seu rolê ideal: ..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      <div className="flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={pending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002776] text-white text-xs font-semibold disabled:opacity-60">
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Guardar
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
          <X className="w-3.5 h-3.5" /> Cancelar
        </button>
      </div>
    </div>
  )
}

export function QuizResultsManager({ quizId, results }: { quizId: string; results: QuizResult[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)

  async function handleCreate(values: FormState) {
    setPending(true)
    const result = await createResultAction(quizId, values)
    setPending(false)
    if ('ok' in result) { setAdding(false); router.refresh() }
  }

  async function handleUpdate(id: string, values: FormState) {
    setPending(true)
    const result = await updateResultAction(id, quizId, values)
    setPending(false)
    if ('ok' in result) { setEditingId(null); router.refresh() }
  }

  async function handleDelete(id: string) {
    if (confirmingDelete !== id) { setConfirmingDelete(id); return }
    setPending(true)
    setDeleteError(null)
    const result = await deleteResultAction(id, quizId)
    setPending(false)
    setConfirmingDelete(null)
    if ('error' in result) setDeleteError(result.error)
    else router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-gray-900">Resultados</h2>
        <span className="text-xs text-gray-400">{results.length} resultado{results.length !== 1 ? 's' : ''}</span>
      </div>
      <p className="text-xs text-gray-400 -mt-2">Crea los resultados posibles antes de añadir preguntas — cada respuesta debe asociarse a uno.</p>

      {deleteError && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{deleteError}</p>}

      <div className="space-y-2">
        {results.map((r) =>
          editingId === r.id ? (
            <ResultForm
              key={r.id}
              initial={{ title: r.title, icon: r.icon ?? '', subtitle: r.subtitle ?? '', description: r.description ?? '', ideal_role: r.ideal_role ?? '' }}
              onCancel={() => setEditingId(null)}
              onSubmit={(v) => handleUpdate(r.id, v)}
              pending={pending}
            />
          ) : (
            <div key={r.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
              <span className="text-xl shrink-0">{r.icon || '🇧🇷'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                {r.subtitle && <p className="text-xs text-gray-400 truncate">{r.subtitle}</p>}
              </div>
              <button type="button" onClick={() => setEditingId(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={pending}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors',
                  confirmingDelete === r.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                )}
              >
                <Trash2 className="w-3.5 h-3.5" /> {confirmingDelete === r.id && '¿Confirmar?'}
              </button>
            </div>
          )
        )}
      </div>

      {adding ? (
        <ResultForm initial={EMPTY} onCancel={() => setAdding(false)} onSubmit={handleCreate} pending={pending} />
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#002776] hover:bg-[#002776]/5 px-3 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Añadir resultado
        </button>
      )}
    </div>
  )
}
