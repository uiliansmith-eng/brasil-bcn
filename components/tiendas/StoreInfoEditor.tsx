'use client'

import { useState } from 'react'
import { Pencil, AtSign, Clock, Globe2, MapPin } from 'lucide-react'
import { ActivateStoreForm } from './ActivateStoreForm'
import type { Company } from '@/types'

const LANGUAGE_LABELS: Record<string, string> = { pt: 'Português', es: 'Español', en: 'English' }

interface StoreInfoEditorProps {
  company: Company
}

export function StoreInfoEditor({ company }: StoreInfoEditorProps) {
  const [editing, setEditing] = useState(false)
  const businessHours = (company.business_hours as { text?: string } | null)?.text ?? null

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="font-black text-gray-900 text-lg mb-5">Editar información de la tienda</h2>
        <ActivateStoreForm
          companyId={company.id}
          companyName={company.name}
          companySlug={company.slug}
          mode="edit"
          defaultValues={{
            instagram: company.instagram ?? '',
            business_hours: businessHours ?? '',
            language: (company.language as 'pt' | 'es' | 'en') ?? 'pt',
            extra_info: company.extra_info ?? '',
            store_category_id: company.store_category_id ?? '',
            store_subcategory_id: company.store_subcategory_id ?? '',
            latitude: company.latitude ?? undefined,
            longitude: company.longitude ?? undefined,
          }}
          onSaved={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-gray-900 text-lg">Información de la tienda</h2>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
        >
          <Pencil className="w-3.5 h-3.5" /> Editar
        </button>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2.5 text-gray-600">
          <AtSign className="w-4 h-4 text-gray-400 shrink-0" />
          {company.instagram || <span className="text-gray-400">Sin Instagram</span>}
        </div>
        <div className="flex items-center gap-2.5 text-gray-600">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          {businessHours || <span className="text-gray-400">Sin horario</span>}
        </div>
        <div className="flex items-center gap-2.5 text-gray-600">
          <Globe2 className="w-4 h-4 text-gray-400 shrink-0" />
          {LANGUAGE_LABELS[company.language] ?? company.language}
        </div>
        <div className="flex items-center gap-2.5 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          {company.latitude !== null && company.longitude !== null
            ? `${company.latitude}, ${company.longitude}`
            : <span className="text-gray-400">Sin coordenadas</span>}
        </div>
        {company.extra_info && (
          <p className="text-gray-500 pt-2 border-t border-gray-50 whitespace-pre-wrap">{company.extra_info}</p>
        )}
      </div>
    </div>
  )
}
