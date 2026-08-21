'use client'

import { useState } from 'react'
import { Plus, Pencil, Tag } from 'lucide-react'
import { StoreItemForm } from './StoreItemForm'
import { deleteStoreItemAction, toggleStoreItemActiveAction } from '@/actions/stores'
import { STORE_ITEM_TYPE_LABELS } from '@/lib/constants'
import type { StoreItem } from '@/types'

interface StoreItemsManagerProps {
  companyId: string
  items: StoreItem[]
}

export function StoreItemsManager({ companyId, items }: StoreItemsManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null)

  const openNew = () => { setEditingItem(null); setShowForm(true) }
  const openEdit = (item: StoreItem) => { setEditingItem(item); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditingItem(null) }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-gray-900 text-lg">Productos y servicios</h2>
        {!showForm && (
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-5">
          <StoreItemForm companyId={companyId} item={editingItem ?? undefined} onDone={closeForm} />
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10">
          <Tag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Todavía no añadiste productos ni servicios.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-gray-50 shrink-0 overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Tag className="w-4 h-4 text-gray-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {STORE_ITEM_TYPE_LABELS[item.item_type]}
                  {item.price !== null && ` · ${item.price}€`}
                  {item.duration_min && ` · ${item.duration_min} min`}
                </p>
              </div>

              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${item.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.is_active ? 'Visible' : 'Oculto'}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <form action={toggleStoreItemActiveAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="is_active" value={String(item.is_active)} />
                  <button type="submit" className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">
                    {item.is_active ? 'Ocultar' : 'Mostrar'}
                  </button>
                </form>
                <form action={deleteStoreItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 rounded-lg">
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
