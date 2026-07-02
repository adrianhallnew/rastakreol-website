import type { CollectionConfig } from 'payload'
import { isAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'support',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Fulfillment', value: 'fulfillment' },
        { label: 'Support', value: 'support' },
      ],
    },
  ],
}
