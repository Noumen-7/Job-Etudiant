import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublic =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/avatars') ||
    pathname.startsWith('/api/cv') ||
    pathname === '/'

  if (isPublic) return NextResponse.next()

  const token = req.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))

  try {
    const payload = verifyToken(token)
    if (pathname.startsWith('/etudiant') && payload.role !== 'ETUDIANT')
      return NextResponse.redirect(new URL('/entreprise/dashboard', req.url))
    if (pathname.startsWith('/entreprise') && payload.role !== 'ENTREPRISE')
      return NextResponse.redirect(new URL('/etudiant/accueil', req.url))
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/auth/login', req.url))
    res.cookies.delete('token')
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
}