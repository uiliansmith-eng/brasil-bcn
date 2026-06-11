import { Suspense } from 'react'
import type { Metadata } from 'next'
import { NuevoArticuloForm } from './NuevoArticuloForm'

export const metadata: Metadata = { title: 'Admin · Nuevo artículo' }

export default function NuevoArticuloPage() {
  return (
    <Suspense>
      <NuevoArticuloForm />
    </Suspense>
  )
}
