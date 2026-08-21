'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { addStoreEmployeeAction, removeStoreEmployeeAction } from '@/actions/stores'
import type { StoreEmployee, StoreEmployeeRole } from '@/types'

type EmployeeRow = StoreEmployee & { profile: { full_name: string | null; email: string; avatar_url: string | null } | null }

interface EmployeesManagerProps {
  companyId: string
  employees: EmployeeRow[]
}

const ROLE_LABELS: Record<StoreEmployeeRole, string> = { employee: 'Empleado', manager: 'Encargado' }

interface AddEmployeeForm {
  email: string
  role: StoreEmployeeRole
}

export function EmployeesManager({ companyId, employees }: EmployeesManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddEmployeeForm>({ defaultValues: { role: 'employee' } })

  const onSubmit = async (data: AddEmployeeForm) => {
    setServerError(null)
    const result = await addStoreEmployeeAction(companyId, data.email, data.role)
    if ('error' in result) { setServerError(result.error); return }
    reset({ email: '', role: 'employee' })
    setShowForm(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-[#009C3B]" /> Empleados
        </h2>
        {!showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]">
            <Plus className="w-4 h-4" /> Añadir
          </button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Los empleados pueden gestionar catálogo, cupones, horario, promociones, pedidos, reservas y reseñas. No pueden editar la información de la tienda, sus módulos, la galería, la suscripción ni añadir otros empleados.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 p-4 bg-gray-50 rounded-xl space-y-3">
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <FormField label="Email del usuario" type="email" placeholder="empleado@ejemplo.com" {...register('email', { required: true })} />
          <div className="flex gap-2">
            {(['employee', 'manager'] as const).map((r) => (
              <label key={r} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" value={r} {...register('role')} /> {ROLE_LABELS[r]}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Añadir'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {employees.length === 0 ? (
        <p className="text-gray-400 text-sm">Todavía no añadiste empleados.</p>
      ) : (
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{emp.profile?.full_name ?? emp.profile?.email ?? 'Usuario'}</p>
                <p className="text-xs text-gray-400">{emp.profile?.email}</p>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">{ROLE_LABELS[emp.role]}</span>
              <form action={removeStoreEmployeeAction}>
                <input type="hidden" name="id" value={emp.id} />
                <button type="submit" className="text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
