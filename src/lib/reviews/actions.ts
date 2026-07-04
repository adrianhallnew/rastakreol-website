'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../auth/get-current-customer'

export type SubmitReviewResult = { success: true } | { success: false; error: string }

// Verified-purchase gate (spec 3.11): the order must belong to the caller, be delivered, and
// actually contain this product. The DB-level unique (product, order) index on Reviews
// (src/collections/Reviews.ts) is the final backstop against a duplicate, not this check alone.
export async function submitReviewAction(
  orderId: number,
  productId: number,
  rating: '1' | '2' | '3' | '4' | '5',
  title: string,
  body: string,
): Promise<SubmitReviewResult> {
  const customer = await getCurrentCustomer()
  if (!customer) return { success: false, error: 'Not logged in.' }
  if (!body.trim()) return { success: false, error: 'Review body is required.' }

  const payload = await getPayload({ config })

  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true })
  const orderCustomerId = typeof order.customer === 'object' ? order.customer.id : order.customer
  if (orderCustomerId !== customer.id) return { success: false, error: 'This is not your order.' }
  if (order.status !== 'delivered') return { success: false, error: 'This order has not been delivered yet.' }

  const productInOrder = order.items.some((item) => {
    const itemProductId = typeof item.product === 'object' ? item.product.id : item.product
    return itemProductId === productId
  })
  if (!productInOrder) return { success: false, error: 'This product was not part of that order.' }

  try {
    await payload.create({
      collection: 'reviews',
      data: {
        product: productId,
        order: orderId,
        customer: customer.id,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
        approved: false,
      },
      overrideAccess: true,
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Could not submit review.' }
  }
}
