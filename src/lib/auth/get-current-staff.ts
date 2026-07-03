import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '../../payload-types'

type StaffAuthResult = {
  user: User | null
  // Payload's session auth can rotate/refresh the session and return an updated
  // Set-Cookie here — must be applied to the outgoing response or the browser's
  // cookie goes stale after one use and the next request fails to authenticate.
  responseHeaders?: Headers
}

export async function getCurrentStaff(headers: Headers): Promise<StaffAuthResult> {
  const payload = await getPayload({ config })
  const { user, responseHeaders } = await payload.auth({ headers })

  if (!user || user.collection !== 'users') return { user: null, responseHeaders }

  return { user: user as User, responseHeaders }
}

export const applyAuthHeaders = (res: Response, authHeaders?: Headers) => {
  authHeaders?.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') res.headers.append(key, value)
  })
}
