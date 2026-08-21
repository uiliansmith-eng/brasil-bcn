import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStoreBySlug, getActiveStoreModuleKeys } from '@/actions/stores'
import { CheckoutForm } from '@/components/tiendas/CheckoutForm'

export const metadata: Metadata = { title: 'Finalizar pedido — Brasil BCN' }

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirect=/tiendas/${slug}/checkout`)

  const store = await getStoreBySlug(slug)
  if (!store) notFound()

  const modules = await getActiveStoreModuleKeys(store.id)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/tiendas/${slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a {store.name}
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">Finalizar pedido</h1>

        <CheckoutForm companyId={store.id} storeSlug={store.slug} hasDelivery={modules.has('delivery')} />
      </div>
    </div>
  )
}
