import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '../lib/access'

export const ShippingSettings: GlobalConfig = {
  slug: 'shipping-settings',
  label: 'Shipping',
  access: {
    read: () => true,
    update: isAdminOrManager,
  },
  fields: [
    {
      name: 'courier_rate',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Flat courier rate in SCR. Applied to all courier orders.',
      },
    },
    {
      name: 'free_shipping_threshold',
      type: 'number',
      admin: {
        description: 'Order total above which courier shipping is free (SCR). Leave blank to disable.',
      },
    },
    {
      name: 'pickup_locations',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'island',
          type: 'text',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
