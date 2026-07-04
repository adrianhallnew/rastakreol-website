'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../auth/get-current-customer'
import type { Wishlist } from '../../payload-types'

export type WishlistToggleResult =
  | { success: true; saved: boolean }
  | { success: false; needsLogin: true }
  | { success: false; needsLogin?: false; error: string }

// depth 0 (default): items[].product stays a bare id — enough to build the id set below.
// depth 2: /account/wishlist needs items[].product.images[].image resolved to a real
// Media doc (wishlist -> product -> images.image = 2 relationship hops).
export async function getWishlist(depth = 0): Promise<Wishlist | null> {
  const customer = await getCurrentCustomer()
  if (!customer) return null

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'wishlist',
    where: { customer: { equals: customer.id } },
    limit: 1,
    depth,
    overrideAccess: false,
    user: customer,
  })
  return result.docs[0] ?? null
}

// Plain array, not a Set — this crosses the Server -> Client Component boundary as a prop
// (ShopResults etc. are 'use client'), and Sets aren't a serializable RSC prop type.
export async function getWishlistedProductIds(): Promise<number[]> {
  const wishlist = await getWishlist()
  return (wishlist?.items ?? []).map((item) =>
    typeof item.product === 'object' ? item.product.id : item.product,
  )
}

export async function toggleWishlistAction(productId: number): Promise<WishlistToggleResult> {
  const customer = await getCurrentCustomer()
  if (!customer) return { success: false, needsLogin: true }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'wishlist',
    where: { customer: { equals: customer.id } },
    limit: 1,
    overrideAccess: false,
    user: customer,
  })
  const wishlist = existing.docs[0]

  if (!wishlist) {
    await payload.create({
      collection: 'wishlist',
      data: {
        customer: customer.id,
        items: [{ product: productId, created_at: new Date().toISOString() }],
      },
      overrideAccess: false,
      user: customer,
    })
    return { success: true, saved: true }
  }

  const items = wishlist.items ?? []
  const idx = items.findIndex((item) => (typeof item.product === 'object' ? item.product.id : item.product) === productId)

  const newItems =
    idx >= 0
      ? items.filter((_, i) => i !== idx)
      : [...items, { product: productId, created_at: new Date().toISOString() }]

  await payload.update({
    collection: 'wishlist',
    id: wishlist.id,
    data: { items: newItems },
    overrideAccess: false,
    user: customer,
  })
  return { success: true, saved: idx < 0 }
}
