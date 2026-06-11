import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/perfil', '/empleos/publicar', '/empresas/registrar', '/eventos/publicar', '/compraventa/publicar']
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password']
const ADMIN_ROUTES = ['/admin']
const MAINTENANCE_BYPASS = ['/proximamente', '/auth', '/api', '/admin']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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

  // ─── Maintenance mode ─────────────────────────────────────────────────────
  if (process.env.MAINTENANCE_MODE === '1') {
    const previewToken = request.nextUrl.searchParams.get('preview')
    const hasBypassCookie = request.cookies.get('preview_bypass')?.value === 'brasilbcn2026'
    const hasValidToken = previewToken === 'brasilbcn2026'
    const isBypass = hasValidToken || hasBypassCookie || MAINTENANCE_BYPASS.some((r) => pathname.startsWith(r))

    if (!isBypass) {
      // Allow admins through — check role
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/proximamente', request.url))
        }
      } else {
        return NextResponse.redirect(new URL('/proximamente', request.url))
      }
    }

    // Persist the bypass as a cookie so the user doesn't need ?preview= on every page
    if (hasValidToken && !hasBypassCookie) {
      supabaseResponse.cookies.set('preview_bypass', 'brasilbcn2026', {
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax',
      })
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (isAuthRoute && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const dest = profile?.role === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin route protection — requires role check via profile
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
