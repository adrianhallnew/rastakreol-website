import { NextResponse, type NextRequest } from 'next/server'
import { verifyCustomerToken } from './lib/auth/verify-token-edge'

const PUBLIC_ACCOUNT_PATHS = ['/account/login', '/account/register', '/account/verify-email', '/account/reset-password']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/account') {
    return NextResponse.next()
  }

  if (PUBLIC_ACCOUNT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('payload-token')?.value

  if (token && (await verifyCustomerToken(token)) !== null) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/account/login', req.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: '/account/:path*',
}
