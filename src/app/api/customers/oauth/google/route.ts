import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const redirectAfter = searchParams.get('redirect') ?? '/'
  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customers/oauth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  )

  const cookieOpts = {
    httpOnly: true,
    // Real request protocol, not NODE_ENV — see src/lib/http/is-secure-request.ts.
    secure: req.headers.get('x-forwarded-proto') === 'https',
    sameSite: 'lax' as const,
    maxAge: 600,
    path: '/',
  }
  res.cookies.set('oauth_state', state, cookieOpts)
  res.cookies.set('oauth_redirect', redirectAfter, cookieOpts)

  return res
}
