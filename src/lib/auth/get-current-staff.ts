import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyStaffToken } from './verify-token-edge'
import type { User } from '../../payload-types'

type StaffAuthResult = {
  user: User | null
}

function getCookieValue(headers: Headers, name: string): string | undefined {
  const cookieHeader = headers.get('cookie')
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

export async function getCurrentStaff(headers: Headers): Promise<StaffAuthResult> {
  const token = getCookieValue(headers, 'payload-token')
  if (!token) return { user: null }

  const staffId = await verifyStaffToken(token)
  if (staffId === null) return { user: null }

  const payload = await getPayload({ config })
  try {
    const user = await payload.findByID({ collection: 'users', id: staffId, overrideAccess: true })
    return { user }
  } catch {
    return { user: null }
  }
}
