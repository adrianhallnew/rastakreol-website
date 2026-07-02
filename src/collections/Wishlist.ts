import type { CollectionConfig } from 'payload'
import { isStaffOrOwn } from '../lib/access'

export const Wishlist: CollectionConfig = {
  slug: 'wishlist',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    read: isStaffOrOwn('customer'),
    create: ({ req: { user } }) => user?.collection === 'customers',
    update: isStaffOrOwn('customer'),
    delete: isStaffOrOwn('customer'),
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
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
        {
          name: 'created_at',
          type: 'date',
        },
      ],
    },
  ],
}
