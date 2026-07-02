import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { isAdmin, isAdminOrManager, isStaffOrOwn } from '../lib/access'

const generateOrderNumber: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const year = new Date().getFullYear()
  const result = await req.payload.find({
    collection: 'orders',
    where: { order_number: { like: `RK-${year}-%` } },
    limit: 0,
  })
  const seq = String(result.totalDocs + 1).padStart(4, '0')
  return { ...data, order_number: `RK-${year}-${seq}` }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'order_number',
  },
  hooks: {
    beforeChange: [generateOrderNumber],
  },
  access: {
    read: isStaffOrOwn('customer'),
    create: ({ req: { user } }) => !user || user.collection === 'customers',
    update: isAdminOrManager,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'order_number',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated: RK-YYYY-XXXX',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Ready', value: 'ready' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'status_history',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Audit trail of all status changes.',
      },
      fields: [
        { name: 'status', type: 'text' },
        { name: 'changed_at', type: 'date' },
        {
          name: 'changed_by',
          type: 'relationship',
          relationTo: 'users',
        },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'variant_sku', type: 'text', required: true },
        { name: 'size', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        {
          name: 'unit_price',
          type: 'number',
          required: true,
          admin: { description: 'Price snapshot at time of order (SCR).' },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping_cost',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping_address',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'address_line1', type: 'text' },
        { name: 'address_line2', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'island', type: 'text' },
      ],
    },
    {
      name: 'delivery_method',
      type: 'select',
      options: [
        { label: 'Courier', value: 'courier' },
        { label: 'Pickup', value: 'pickup' },
      ],
    },
    {
      name: 'pickup_location',
      type: 'text',
    },
    {
      name: 'payment_status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'payment_reference',
      type: 'text',
      unique: true,
      admin: {
        description: 'MCB payment reference. Unique — prevents duplicate processing.',
      },
    },
    {
      name: 'assigned_staff',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'cancellation_reason',
      type: 'text',
    },
    {
      name: 'customer_notes',
      type: 'textarea',
    },
  ],
}
