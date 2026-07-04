import { cookies } from 'next/headers'
import { isSecureRequest } from '../http/is-secure-request'

export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('payload-token', token, {
    httpOnly: true,
    secure: await isSecureRequest(),
    sameSite: 'lax',
    maxAge: 7200,
    path: '/',
  })
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
}
