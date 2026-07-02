import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../lib/access'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: isStaff,
    create: () => false,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'New Order', value: 'new_order' },
        { label: 'Order Status Change', value: 'order_status_change' },
        { label: 'Low Stock', value: 'low_stock' },
        { label: 'Payment Received', value: 'payment_received' },
        { label: 'Payment Failed', value: 'payment_failed' },
        { label: 'New Review', value: 'new_review' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Leave blank to broadcast to all staff.',
      },
    },
  ],
}
