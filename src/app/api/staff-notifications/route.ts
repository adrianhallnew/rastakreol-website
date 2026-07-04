import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentStaff } from '../../../lib/auth/get-current-staff'

export async function GET(req: NextRequest) {
  const { user: staff } = await getCurrentStaff(req.headers)
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const unreadOnly = new URL(req.url).searchParams.get('unread') === 'true'

  const result = await payload.find({
    collection: 'notifications',
    where: {
      or: [{ recipient: { exists: false } }, { recipient: { equals: staff.id } }],
    },
    sort: '-createdAt',
    limit: 50,
    overrideAccess: false,
    user: staff,
  })

  const reads = await payload.find({
    collection: 'notifications-reads',
    where: {
      and: [
        { user: { equals: staff.id } },
        { notification: { in: result.docs.map((doc) => doc.id) } },
      ],
    },
    limit: 0,
    overrideAccess: true,
  })
  const readIds = new Set(
    reads.docs.map((r) => (typeof r.notification === 'object' ? r.notification.id : r.notification)),
  )

  const notifications = result.docs
    .map((doc) => ({ ...doc, read: readIds.has(doc.id) }))
    .filter((doc) => !unreadOnly || !doc.read)

  const unreadCount = result.docs.filter((doc) => !readIds.has(doc.id)).length

  return NextResponse.json({ notifications, unreadCount })
}
