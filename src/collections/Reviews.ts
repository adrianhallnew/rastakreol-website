import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrManager } from '../lib/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) =>
      user?.collection === 'users' ? true : { approved: { equals: true } },
    create: ({ req: { user } }) => user?.collection === 'customers',
    update: isAdminOrManager,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: '1 star', value: '1' },
        { label: '2 stars', value: '2' },
        { label: '3 stars', value: '3' },
        { label: '4 stars', value: '4' },
        { label: '5 stars', value: '5' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
