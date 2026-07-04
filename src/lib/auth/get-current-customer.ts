import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyCustomerToken } from './verify-token-edge'
import type { Customer } from '../../payload-types'

// Verifies the JWT itself rather than going through payload.auth() — see
// verifyCustomerToken's own comment for why: payload.auth()'s CSRF/Origin check rejects a
// legitimate same-origin request on iOS Safari for a Next.js-internal reason unrelated to
// this app's actual security boundary (the JWT signature, verified here).
export async function getCurrentCustomer(): Promise<Customer | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null

  const customerId = await verifyCustomerToken(token)
  if (customerId === null) return null

  const payload = await getPayload({ config })
  try {
    return await payload.findByID({ collection: 'customers', id: customerId, overrideAccess: true })
  } catch {
    return null
  }
}
