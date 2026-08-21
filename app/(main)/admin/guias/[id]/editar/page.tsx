import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateGuideForm } from '@/components/admin/CreateGuideForm'
import { getGuideForAdmin } from '@/actions/admin'
import type { CreateGuideInput } from '@/lib/validations/guides'

export const metadata: Metadata = { title: 'Editar guía — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarGuiaPage({ params }: PageProps) {
  const { id } = await params
  const guide = await getGuideForAdmin(id)
  if (!guide) notFound()

  const defaultValues: CreateGuideInput = {
    title: guide.title,
    excerpt: guide.excerpt ?? '',
    content: guide.content,
    category: guide.category,
    cover_url: guide.cover_url ?? '',
    is_published: guide.is_published,
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guias" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a guías
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Editar guía</h1>
        <p className="text-gray-500 text-sm mt-1">El slug ({guide.slug}) no cambia aunque edites el título</p>
      </div>
      <CreateGuideForm guideId={guide.id} defaultValues={defaultValues} />
    </div>
  )
}
