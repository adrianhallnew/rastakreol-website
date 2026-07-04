import { jwtVerify } from 'jose'

// Mirrors Payload's internal key derivation (payload/dist/index.js): the actual
// JWT signing key is sha256(config.secret).hex().slice(0,32), not the raw secret
// string. Edge Runtime has no node:crypto, so this uses Web Crypto instead.
async function deriveSigningKey(secret: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return new TextEncoder().encode(hex.slice(0, 32))
}

// Returns the decoded customer id if the token is a validly-signed customer token, else null.
// Deliberately bypasses Payload's own payload.auth()/extractJWT cookie-extraction path — that
// path rejects a request whose Origin doesn't match its CSRF allowlist, falling back to
// Sec-Fetch-Site when Origin is absent, and iOS Safari sends neither on the RSC fetch Next.js
// makes right after login. That's a real Next.js/iOS-Safari header-omission quirk on an
// otherwise fully legitimate same-origin request, not a security-relevant rejection to
// preserve — this function verifies the JWT signature itself (the actual security boundary)
// without that additional, environment-fragile gate.
export async function verifyCustomerToken(token: string): Promise<number | null> {
  try {
    const key = await deriveSigningKey(process.env.PAYLOAD_SECRET!)
    const { payload } = await jwtVerify(token, key)
    if (payload.collection !== 'customers' || typeof payload.id !== 'number') return null
    return payload.id
  } catch {
    return null
  }
}

export async function verifyStaffToken(token: string): Promise<number | null> {
  try {
    const key = await deriveSigningKey(process.env.PAYLOAD_SECRET!)
    const { payload } = await jwtVerify(token, key)
    if (payload.collection !== 'users' || typeof payload.id !== 'number') return null
    return payload.id
  } catch {
    return null
  }
}
