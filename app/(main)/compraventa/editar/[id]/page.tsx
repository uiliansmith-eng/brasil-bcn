import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PublishListingForm } from '@/components/compraventa/PublishListingForm'

export const metadata: Metadata = { title: 'Editar anuncio — BrasilBCN' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id)
    .eq('is_active', true)
    .single()

  if (!listing) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Editar anuncio</h1>
      <p className="text-gray-500 text-sm mb-8">Los cambios se publican de inmediato.</p>
      <PublishListingForm listing={listing} />
    </div>
  )
}
