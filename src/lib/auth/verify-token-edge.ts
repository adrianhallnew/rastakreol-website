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

export async function verifyCustomerTokenEdge(token: string): Promise<boolean> {
  try {
    const key = await deriveSigningKey(process.env.PAYLOAD_SECRET!)
    const { payload } = await jwtVerify(token, key)
    return payload.collection === 'customers'
  } catch {
    return false
  }
}
