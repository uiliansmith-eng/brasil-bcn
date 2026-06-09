import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Plus, Eye, Clock } from 'lucide-react'
import { getAdminGuides, toggleGuidePublishAction, deleteGuideAction } from '@/actions/admin'
import { GUIDE_CATEGORY_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Guías — Admin' }

export default async function AdminGuiasPage() {
  const guides = await getAdminGuides()
  const published = guides.filter((g) => g.is_published).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Guías</h1>
          <p className="text-gray-500 text-sm mt-1">
            {guides.length} total · {published} publicadas · {guides.length - published} borradores
          </p>
        </div>
        <Link href="/admin/guias/nueva">
          <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
            <Plus className="w-4 h-4" /> Nueva guía
          </Button>
        </Link>
      </div>

      {guides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Sin guías</p>
          <p className="text-gray-400 text-sm mb-6">Crea la primera guía para la comunidad</p>
          <Link href="/admin/guias/nueva">
            <Button className="bg-[#002776] hover:bg-[#001a5c] text-white gap-2">
              <Plus className="w-4 h-4" /> Nueva guía
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${guide.is_published ? 'bg-[#002776]/10' : 'bg-gray-100'}`}>
                <BookOpen className={`w-5 h-5 ${guide.is_published ? 'text-[#002776]' : 'text-gray-400'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-900 truncate">{guide.title}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${guide.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {guide.is_published ? 'Publicada' : 'Borrador'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-3">
                  <span>{GUIDE_CATEGORY_LABELS[guide.category as keyof typeof GUIDE_CATEGORY_LABELS] ?? guide.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{guide.reading_time} min</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{guide.views ?? 0}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {guide.slug && (
                  <Link href={`/guia/${guide.slug}`} target="_blank">
                    <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                      Ver
                    </button>
                  </Link>
                )}
                <form action={toggleGuidePublishAction}>
                  <input type="hidden" name="id" value={guide.id} />
                  <input type="hidden" name="is_published" value={String(guide.is_published)} />
                  <button type="submit" className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${guide.is_published ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#002776] hover:bg-[#001a5c] text-white'}`}>
                    {guide.is_published ? 'Despublicar' : 'Publicar'}
                  </button>
                </form>
                <form action={deleteGuideAction}>
                  <input type="hidden" name="id" value={guide.id} />
                  <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
