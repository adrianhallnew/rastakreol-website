import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../lib/access'

export const NotificationsReads: CollectionConfig = {
  slug: 'notifications-reads',
  admin: {
    useAsTitle: 'id',
  },
  indexes: [{ unique: true, fields: ['notification', 'user'] }],
  access: {
    read: isStaff,
    create: () => false,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'read_at',
      type: 'date',
      required: true,
    },
  ],
}
