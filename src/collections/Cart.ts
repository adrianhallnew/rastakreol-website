import type { CollectionConfig } from 'payload'
import { isStaffOrOwn } from '../lib/access'

export const Cart: CollectionConfig = {
  slug: 'cart',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    read: isStaffOrOwn('customer'),
    create: ({ req: { user } }) => !user || user.collection === 'customers',
    update: isStaffOrOwn('customer'),
    delete: isStaffOrOwn('customer'),
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        description: 'Null for guest carts — use session_id instead.',
      },
    },
    {
      name: 'session_id',
      type: 'text',
      admin: {
        description: 'Guest cart identifier (e.g. anonymous session cookie).',
      },
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'variant_sku', type: 'text', required: true },
        { name: 'size', type: 'text', required: true },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price_snapshot',
          type: 'number',
          required: true,
          admin: { description: 'Product price at time of adding to cart (SCR).' },
        },
        {
          name: 'added_at',
          type: 'date',
        },
      ],
    },
  ],
}
