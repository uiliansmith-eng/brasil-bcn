'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createFAQ, deleteFAQ } from '@/actions/ruta'

interface FAQ {
  id: string
  question: string
  answer: string
  position: number
}

interface Props {
  stepId: string
  initialFaqs: FAQ[]
}

const empty = { question: '', answer: '' }

export function StepFAQsSection({ stepId, initialFaqs }: Props) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error: err } = await createFAQ({
      step_id: stepId,
      question: form.question,
      answer: form.answer,
      position: faqs.length + 1,
    })
    setSaving(false)
    if (err) { setError(err); return }
    setFaqs(prev => [...prev, {
      id: crypto.randomUUID(),
      question: form.question,
      answer: form.answer,
      position: prev.length + 1,
    }])
    setForm(empty)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta FAQ?')) return
    const { error: err } = await deleteFAQ(id)
    if (err) { setError(err); return }
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {faqs.length > 0 && (
        <div className="space-y-2 mb-3">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              >
                <p className="text-sm font-semibold text-gray-800">❓ {f.question}</p>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-gray-400 text-lg">{expanded === f.id ? '−' : '+'}</span>
                </div>
              </button>
              {expanded === f.id && (
                <div className="px-4 pb-3 border-t border-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.answer}</p>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {faqs.length === 0 && !showForm && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-5 text-center text-gray-400 text-sm mb-3">
          Sin FAQs todavía.
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pregunta *</label>
            <input
              required value={form.question}
              onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
              placeholder="¿Puedo hacer...?"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Respuesta *</label>
            <textarea
              required rows={3} value={form.answer}
              onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 resize-none"
              placeholder="Respuesta clara y concisa..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setForm(empty) }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#FFDF00] text-gray-900 text-sm font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors">
              <Plus className="w-3.5 h-3.5" /> {saving ? 'Añadiendo…' : 'Añadir FAQ'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Añadir FAQ
        </button>
      )}
    </div>
  )
}
