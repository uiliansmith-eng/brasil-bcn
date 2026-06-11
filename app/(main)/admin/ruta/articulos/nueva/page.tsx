'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NuevoArticuloPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stepId = searchParams.get('step') ?? ''

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    seo_title: '',
    seo_description: '',
    published: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toSlug(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stepId) { setError('Falta el step_id en la URL.'); return }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('guide_articles').insert({
      step_id: stepId,
      ...form,
      slug: form.slug || toSlug(form.title),
    })
    if (err) { setError(err.message); setSaving(false); return }
    router.push(`/admin/ruta/steps/${stepId}`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <Link href={stepId ? `/admin/ruta/steps/${stepId}` : '/admin/ruta'} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#002776] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="text-xl font-black text-gray-900 mb-6">Nuevo artículo</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título *</label>
            <input
              required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: toSlug(e.target.value) }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
              placeholder="Título del artículo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
            <input
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
              placeholder="se-genera-automaticamente"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resumen</label>
            <textarea
              rows={2} value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none"
              placeholder="Breve descripción del artículo (máx. 160 caracteres)"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contenido</label>
            <textarea
              rows={10} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none font-mono"
              placeholder="Escribe el contenido aquí. Usa Markdown o texto plano."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="font-semibold text-gray-900 text-sm">SEO</p>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Título SEO</label>
            <input
              value={form.seo_title}
              onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meta descripción</label>
            <textarea
              rows={2} value={form.seo_description}
              onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publicar ahora</span>
          </label>
          <button
            type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#002776] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#001a5c] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Guardando…' : 'Guardar artículo'}
          </button>
        </div>
      </form>
    </div>
  )
}
