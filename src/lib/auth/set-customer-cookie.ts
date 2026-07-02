import { cookies } from 'next/headers'

export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('payload-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7200,
    path: '/',
  })
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
}
