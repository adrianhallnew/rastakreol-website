import { headers } from 'next/headers'

// Real request protocol, not NODE_ENV. `next start` (production build) sets NODE_ENV to
// 'production' regardless of whether the actual connection is HTTPS — testing a production
// build over plain HTTP via a LAN IP (e.g. phone testing before a real deploy) still needs
// `secure: false`, or the browser silently drops the cookie (a `secure` cookie is only
// stored over HTTPS, and only `localhost` gets a same-origin exemption from that rule — a
// bare LAN IP doesn't). On a real deployment (Vercel or similar), the proxy sets
// x-forwarded-proto: https, so this still resolves correctly there.
export async function isSecureRequest(): Promise<boolean> {
  const headerList = await headers()
  return headerList.get('x-forwarded-proto') === 'https'
}
