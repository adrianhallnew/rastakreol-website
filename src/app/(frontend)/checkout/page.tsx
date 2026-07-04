import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../../../lib/auth/get-current-customer'
import { getOwnedCartWithProducts } from '../../../lib/cart/actions'
import { checkCartPriceStaleness } from '../../../lib/cart/price-staleness'
import { PriceChangeNotice } from '../../../components/checkout/PriceChangeNotice'
import { CheckoutFlow } from '../../../components/checkout/CheckoutFlow'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login?redirect=/checkout')

  const { cart } = await getOwnedCartWithProducts()
  if (!cart || (cart.items ?? []).length === 0) redirect('/cart')

  const staleItems = await checkCartPriceStaleness()
  if (staleItems.length > 0) {
    return <PriceChangeNotice items={staleItems} />
  }

  const subtotal = (cart.items ?? []).reduce((sum, item) => sum + item.price_snapshot * item.quantity, 0)

  const payload = await getPayload({ config })
  const shippingSettings = await payload.findGlobal({ slug: 'shipping-settings', overrideAccess: true })
  const pickupLocations = (shippingSettings.pickup_locations ?? [])
    .filter((location) => location.enabled !== false)
    .map((location) => ({ name: location.name, address: location.address, island: location.island }))

  return (
    <CheckoutFlow
      customer={customer}
      subtotal={subtotal}
      pickupLocations={pickupLocations}
      courierRate={shippingSettings.courier_rate ?? 0}
      freeShippingThreshold={shippingSettings.free_shipping_threshold ?? null}
    />
  )
}
