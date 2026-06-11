'use client'

import { useState } from 'react'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import { createResource, deleteResource } from '@/actions/ruta'

const RESOURCE_TYPES = [
  { value: 'web_oficial', label: '🏛️ Web oficial' },
  { value: 'formulario', label: '📝 Formulario' },
  { value: 'pdf', label: '📄 PDF' },
  { value: 'video', label: '🎬 Video' },
  { value: 'herramienta', label: '🔧 Herramienta' },
]

interface Resource {
  id: string
  title: string
  url: string
  type: string
  description: string | null
  position: number
}

interface Props {
  stepId: string
  initialResources: Resource[]
}

const empty = { title: '', url: '', type: 'web_oficial', description: '' }

export function StepResourcesSection({ stepId, initialResources }: Props) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error: err } = await createResource({
      step_id: stepId,
      title: form.title,
      url: form.url,
      type: form.type,
      description: form.description || null,
      position: resources.length + 1,
    })
    setSaving(false)
    if (err) { setError(err); return }
    setResources(prev => [...prev, {
      id: crypto.randomUUID(),
      title: form.title,
      url: form.url,
      type: form.type,
      description: form.description || null,
      position: prev.length + 1,
    }])
    setForm(empty)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este recurso?')) return
    const { error: err } = await deleteResource(id)
    if (err) { setError(err); return }
    setResources(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {resources.length > 0 && (
        <div className="space-y-2 mb-3">
          {resources.map((r) => (
            <div key={r.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#002776] hover:underline flex items-center gap-1 truncate">
                  <ExternalLink className="w-3 h-3 shrink-0" /> {r.url}
                </a>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <span className="text-xs text-gray-400">{r.type}</span>
                <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {resources.length === 0 && !showForm && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-5 text-center text-gray-400 text-sm mb-3">
          Sin recursos todavía.
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Título *</label>
              <input
                required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
                placeholder="Ej: Web del Ayuntamiento"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
              >
                {RESOURCE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">URL *</label>
            <input
              required type="url" value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción (opcional)</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20"
              placeholder="Breve descripción"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setForm(empty) }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#002776] text-white text-sm font-semibold rounded-lg hover:bg-[#001a5c] disabled:opacity-50 transition-colors">
              <Plus className="w-3.5 h-3.5" /> {saving ? 'Añadiendo…' : 'Añadir recurso'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm text-[#009C3B] hover:text-[#007a2f] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Añadir recurso
        </button>
      )}
    </div>
  )
}
