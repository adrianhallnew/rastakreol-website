import type { PayloadRequest } from 'payload'
import type { Notification } from '../payload-types'

type NotifyArgs = {
  type: Notification['type']
  title: string
  message: string
  order?: number
  product?: number
  recipient?: number
}

// Always pass the triggering hook's `req` through so this write joins the same
// DB transaction as the change that caused it — otherwise it runs in a separate
// connection that can't see the not-yet-committed row (FK violation on create).
export const notify = async (req: PayloadRequest, data: NotifyArgs) => {
  await req.payload.create({
    collection: 'notifications',
    data,
    req,
    overrideAccess: true,
  })
}

type LowStockCheckArgs = {
  productId: number
  variantSku: string
  size: string
  previousStock: number
  newStock: number
  thresholdOverride?: number | null
}

// Reused by the future raw-SQL checkout stock-decrement (bypasses this collection's
// afterChange hook entirely, see architecture.md §4) — call this directly there too.
export const checkLowStockAndNotify = async (req: PayloadRequest, args: LowStockCheckArgs) => {
  const { productId, variantSku, size, previousStock, newStock, thresholdOverride } = args

  const threshold =
    thresholdOverride ??
    ((await req.payload.findGlobal({ slug: 'site-settings', req })).low_stock_threshold ?? 10)

  if (previousStock >= threshold && newStock < threshold) {
    await notify(req, {
      type: 'low_stock',
      product: productId,
      title: `Low stock: ${variantSku}`,
      message: `Size ${size} (SKU ${variantSku}) has ${newStock} left, below threshold of ${threshold}.`,
    })
  }
}
