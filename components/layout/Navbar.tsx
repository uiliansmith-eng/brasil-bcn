'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, Briefcase, Building2, Calendar, BookOpen, Users, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { navItems } from '@/lib/config'
import { useUser } from '@/hooks/useUser'
import { logoutAction } from '@/actions/auth'

const navIcons = {
  Empleos: Briefcase,
  Empresas: Building2,
  Eventos: Calendar,
  Guía: BookOpen,
  Comunidad: Users,
} as const

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loading } = useUser()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Brasil BCN" className="w-9 h-9 rounded-xl object-cover object-top group-hover:opacity-90 transition-opacity" />
            <div className="hidden sm:block">
              <span className="font-black text-xl tracking-tight text-gray-900">Brasil</span>
              <span className="font-black text-xl tracking-tight text-[#009C3B]">BCN</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = navIcons[item.label as keyof typeof navIcons]
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#009C3B] hover:bg-green-50 transition-all duration-200 group"
                >
                  {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#009C3B] transition-colors" />}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-[#009C3B] text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.full_name ?? user.email}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b">
                    <p className="font-semibold text-sm text-gray-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem render={<Link href="/perfil" />} className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" /> Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard" />} className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" /> Panel de control
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem render={<Link href="/admin" />} className="flex items-center gap-2 cursor-pointer text-[#009C3B] font-medium">
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutAction()}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-[#009C3B] hover:bg-[#007a2f] text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  >
                    Únete gratis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Brasil BCN" className="w-8 h-8 rounded-xl object-cover object-top" />
                    <span className="font-black text-lg">
                      <span className="text-gray-900">Brasil</span>
                      <span className="text-[#009C3B]">BCN</span>
                    </span>
                  </Link>
                </div>

                {/* Mobile User Info */}
                {user && (
                  <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-[#009C3B] text-white text-sm font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = navIcons[item.label as keyof typeof navIcons]
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-[#009C3B] hover:bg-green-50 transition-all font-medium"
                      >
                        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile CTA */}
                <div className="p-4 space-y-3 border-t">
                  {user ? (
                    <>
                      <Link href="/perfil" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <User className="w-4 h-4" /> Mi perfil
                        </Button>
                      </Link>
                      <form action={logoutAction}>
                        <Button type="submit" variant="ghost" className="w-full text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">Entrar</Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold">
                          Únete gratis
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  )
}
