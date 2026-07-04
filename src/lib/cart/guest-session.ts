import { cookies } from 'next/headers'
import { isSecureRequest } from '../http/is-secure-request'

const COOKIE_NAME = 'guest-cart-id'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days — matches spec's cart-expiry window

// Only reads — never mints an id. Use getOrCreateGuestCartId() when a write is imminent.
export async function getGuestCartId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

// Mints and persists a new guest cart id if one doesn't already exist. Called only from
// Server Actions right before the first cart write for a not-logged-in caller — knowledge
// of this id is the sole credential for guest cart ownership, so it must stay httpOnly.
export async function getOrCreateGuestCartId(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(COOKIE_NAME)?.value
  if (existing) return existing

  const id = crypto.randomUUID()
  cookieStore.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: await isSecureRequest(),
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  })
  return id
}

export async function clearGuestCartId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
