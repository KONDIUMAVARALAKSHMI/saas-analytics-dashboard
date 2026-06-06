import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isPublicRoute =
    nextUrl.pathname === '/login' ||
    nextUrl.pathname === '/api/health' ||
    nextUrl.pathname.startsWith('/api/auth') ||
    nextUrl.pathname === '/'

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && nextUrl.pathname === '/login') {
    const tenantSlug = (session?.user as any)?.tenantSlug ?? 'acme-corp'
    return NextResponse.redirect(
      new URL(`/tenants/${tenantSlug}/dashboard`, req.url)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
