'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react'
import { updateArticle, deleteArticle } from '@/actions/ruta'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  seo_title: string | null
  seo_description: string | null
  published: boolean
  step_id: string
  last_verified_at: string | null
}

interface Props {
  article: Article
}

export function EditArticuloForm({ article }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? '',
    content: article.content ?? '',
    seo_title: article.seo_title ?? '',
    seo_description: article.seo_description ?? '',
    published: article.published,
    last_verified_at: article.last_verified_at?.slice(0, 10) ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function toSlug(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const { error: err } = await updateArticle(article.id, {
      ...form,
      excerpt: form.excerpt || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      last_verified_at: form.last_verified_at || null,
    })
    setSaving(false)
    if (err) { setError(err); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    const { error: err } = await deleteArticle(article.id)
    if (err) { setError(err); setDeleting(false); return }
    router.push(`/admin/ruta/steps/${article.step_id}`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/admin/ruta/steps/${article.step_id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#002776] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al paso
        </Link>
        {article.published && (
          <Link
            href={`/ruta-brasileno/articulo/${article.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-[#009C3B] hover:underline"
          >
            <Eye className="w-3.5 h-3.5" /> Ver publicado
          </Link>
        )}
      </div>

      <h1 className="text-xl font-black text-gray-900 mb-6">Editar artículo</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">✓ Cambios guardados</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título *</label>
            <input
              required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
            <div className="flex gap-2">
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
              />
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, slug: toSlug(f.title) }))}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
              >
                Regenerar
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resumen</label>
            <textarea
              rows={2} value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contenido</label>
            <textarea
              rows={18} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776] resize-y"
              placeholder="Markdown: ## Título, **negrita**, - lista"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de verificación</label>
            <input
              type="date" value={form.last_verified_at}
              onChange={e => setForm(f => ({ ...f, last_verified_at: e.target.value }))}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
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
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.published}
                onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Publicado</span>
            </label>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {deleting ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
          <button
            type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#002776] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#001a5c] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
