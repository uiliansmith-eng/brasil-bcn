import type { Metadata } from 'next'
import { getUsers } from '@/actions/admin'
import { UserActions } from './UserActions'
import { Users, ShieldOff } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin · Usuarios' }
export const dynamic = 'force-dynamic'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, parseInt(page))
  const { users, total } = await getUsers(currentPage, search)
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">{total} usuarios registrados</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por email o nombre..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/20 focus:border-[#002776]"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#002776] text-white rounded-xl text-sm font-semibold hover:bg-[#001a5c] transition-colors"
        >
          Buscar
        </button>
        {search && (
          <a href="/admin/usuarios" className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
            Limpiar
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-5 py-4">
                {/* Avatar placeholder */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.is_blocked ? 'bg-red-100 text-red-500' : 'bg-[#002776]/10 text-[#002776]'}`}>
                  {user.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.full_name ?? '(sin nombre)'}
                    </p>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold bg-[#002776] text-white px-1.5 py-0.5 rounded">ADMIN</span>
                    )}
                    {user.is_blocked && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                        <ShieldOff className="w-2.5 h-2.5" /> BLOQUEADO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  {user.is_blocked && user.blocked_reason && (
                    <p className="text-xs text-red-400 mt-0.5 truncate">Motivo: {user.blocked_reason}</p>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 shrink-0 hidden sm:block">
                  {new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                </p>

                {/* Actions */}
                {user.role !== 'admin' && (
                  <UserActions userId={user.id} isBlocked={user.is_blocked ?? false} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/usuarios?search=${search}&page=${p}`}
              className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                p === currentPage ? 'bg-[#002776] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#002776]'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
