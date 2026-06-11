import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArticleById } from '@/actions/ruta'
import { EditArticuloForm } from './EditArticuloForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Admin · Editar artículo' }

export default async function EditArticuloPage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticleById(id)
  if (!article) notFound()
  return (
    <Suspense>
      <EditArticuloForm article={article} />
    </Suspense>
  )
}
