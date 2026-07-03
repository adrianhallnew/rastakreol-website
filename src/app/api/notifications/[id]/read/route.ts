import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyAuthHeaders, getCurrentStaff } from '../../../../../lib/auth/get-current-staff'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { user: staff, responseHeaders } = await getCurrentStaff(req.headers)
  if (!staff) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    applyAuthHeaders(res, responseHeaders)
    return res
  }

  const { id } = await context.params
  const notificationId = Number(id)
  if (!Number.isFinite(notificationId)) {
    return NextResponse.json({ error: 'Invalid notification id' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'notifications-reads',
    where: {
      and: [{ notification: { equals: notificationId } }, { user: { equals: staff.id } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length === 0) {
    try {
      await payload.create({
        collection: 'notifications-reads',
        data: { notification: notificationId, user: staff.id, read_at: new Date().toISOString() },
        overrideAccess: true,
      })
    } catch {
      // Unique index on (notification, user) — a concurrent request already marked this read.
    }
  }

  const res = NextResponse.json({ ok: true })
  applyAuthHeaders(res, responseHeaders)
  return res
}
