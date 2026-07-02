import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('oauth_state')?.value
  const redirectAfter = req.cookies.get('oauth_redirect')?.value ?? '/'
  const base = process.env.NEXT_PUBLIC_SERVER_URL!

  const fail = (reason: string) =>
    NextResponse.redirect(`${base}/?auth_error=${reason}`)

  if (!state || state !== storedState) return fail('invalid_state')
  if (!code) return fail('no_code')

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${base}/api/customers/oauth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokenRes.ok) return fail('token_exchange')

    // Fetch Google user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()
    if (!profile.email) return fail('no_email')

    const payload = await getPayload({ config })

    // Find or create Customer — prefer google_id match, fall back to email
    let customer

    const byGoogleId = await payload.find({
      collection: 'customers',
      where: { google_id: { equals: profile.id } },
      limit: 1,
      overrideAccess: true,
    })

    if (byGoogleId.docs.length > 0) {
      customer = byGoogleId.docs[0]
    } else {
      const byEmail = await payload.find({
        collection: 'customers',
        where: { email: { equals: profile.email } },
        limit: 1,
        overrideAccess: true,
      })

      if (byEmail.docs.length > 0) {
        customer = await payload.update({
          collection: 'customers',
          id: byEmail.docs[0].id,
          data: { google_id: profile.id, email_verified: true },
          overrideAccess: true,
        })
      } else {
        customer = await payload.create({
          collection: 'customers',
          data: {
            name: (profile.name as string) ?? (profile.email as string).split('@')[0],
            email: profile.email,
            google_id: profile.id,
            email_verified: true,
            password: crypto.randomBytes(32).toString('hex'),
          },
          overrideAccess: true,
        })
      }
    }

    // Sign a Payload-compatible JWT — Payload derives its actual signing key as
    // sha256(config.secret).hex().slice(0,32), not the raw PAYLOAD_SECRET string,
    // so use payload.secret (already derived) rather than re-deriving it here.
    const secret = new TextEncoder().encode(payload.secret)
    const token = await new SignJWT({
      id: customer.id,
      collection: 'customers',
      email: customer.email,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret)

    const res = NextResponse.redirect(`${base}${redirectAfter}`)
    res.cookies.delete('oauth_state')
    res.cookies.delete('oauth_redirect')
    res.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200,
      path: '/',
    })

    return res
  } catch (err) {
    console.error('[google-oauth-callback]', err)
    return fail('server_error')
  }
}
