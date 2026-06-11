'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Building2, CalendarDays, BookOpen, Megaphone, ShoppingBag, Map, ChevronRight, Users, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/pagina', label: 'Página', icon: Settings2 },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/empleos', label: 'Empleos', icon: Briefcase },
  { href: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/ruta', label: 'Ruta del Brasileño', icon: Map },
  { href: '/admin/guias', label: 'Guías', icon: BookOpen },
  { href: '/admin/publicidad', label: 'Publicidad', icon: Megaphone },
  { href: '/admin/compraventa', label: 'Compra & Venta', icon: ShoppingBag },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Panel Admin</p>
        <nav className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-[#002776] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#002776]'
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {!active && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
