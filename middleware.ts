import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/perfil', '/empleos/publicar', '/empresas/registrar', '/eventos/publicar', '/compraventa/publicar', '/tiendas/crear']
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password']
const ADMIN_ROUTES = ['/admin']
const MAINTENANCE_BYPASS = ['/mantenimiento', '/auth', '/admin', '/_next', '/favicon', '/api']

const REF_COOKIE = 'bcn_ref'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Capture referral code from ?ref=<codigo> into a 30-day cookie, so it
  // survives until the visitor registers (see /auth/register).
  const refCode = request.nextUrl.searchParams.get('ref')
  const finish = (res: NextResponse) => {
    if (refCode) res.cookies.set(REF_COOKIE, refCode, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — IMPORTANT: do not remove
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (isAuthRoute && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const dest = (profile?.role === 'admin' || profile?.role === 'super_admin') ? '/admin' : '/'
    return finish(NextResponse.redirect(new URL(dest, request.url)))
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return finish(NextResponse.redirect(loginUrl))
  }

  // Block banned users + admin route protection
  if (user && !pathname.startsWith('/bloqueado') && !pathname.startsWith('/auth')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_blocked')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    if (profile?.is_blocked && !isAdmin) {
      return finish(NextResponse.redirect(new URL('/bloqueado', request.url)))
    }

    const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
    if (isAdminRoute && !isAdmin) {
      return finish(NextResponse.redirect(new URL('/', request.url)))
    }
  }

  // Maintenance mode — bypass for admins and exempt paths
  const bypassMaintenance = MAINTENANCE_BYPASS.some((r) => pathname.startsWith(r))
  if (!bypassMaintenance) {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('maintenance_mode')
      .eq('id', 1)
      .single()

    if (settings?.maintenance_mode) {
      // Allow logged-in admins through
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role === 'admin' || profile?.role === 'super_admin') return finish(supabaseResponse)
      }
      return finish(NextResponse.redirect(new URL('/mantenimiento', request.url)))
    }
  }

  return finish(supabaseResponse)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
