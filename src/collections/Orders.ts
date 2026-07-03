import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldAccess } from 'payload'
import { ValidationError } from 'payload'
import { isAdmin, isAdminManagerOrFulfillment, isStaffOrOwn, staffRole } from '../lib/access'
import { notify } from '../hooks/notify'

const fieldIsAdminOrManager: FieldAccess = ({ req: { user } }) =>
  !!user && ['admin', 'manager'].includes(staffRole(user))

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

const enforceStatusTransition: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !data.status || data.status === originalDoc?.status) return data

  if (['cancelled', 'refunded'].includes(data.status)) {
    if (!(req.user && ['admin', 'manager'].includes(staffRole(req.user)))) {
      throw new ValidationError({
        collection: 'orders',
        errors: [{ path: 'status', message: 'Only admin or manager can cancel or refund an order.' }],
      })
    }
    if (!(data.cancellation_reason || originalDoc?.cancellation_reason)) {
      throw new ValidationError({
        collection: 'orders',
        errors: [{ path: 'cancellation_reason', message: 'A reason is required to cancel or refund an order.' }],
      })
    }
  }

  return data
}

const appendStatusHistory: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !data.status || data.status === originalDoc?.status) return data

  return {
    ...data,
    status_history: [
      ...(originalDoc?.status_history ?? []),
      {
        status: data.status,
        changed_at: new Date().toISOString(),
        changed_by: req.user?.id,
        note: data.status_change_note,
      },
    ],
  }
}

const notifyOrderEvents: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation === 'create') {
    await notify(req, {
      type: 'new_order',
      order: doc.id,
      title: `New order ${doc.order_number}`,
      message: `Order ${doc.order_number} was placed.`,
    })
    return doc
  }

  if (previousDoc?.status !== doc.status) {
    await notify(req, {
      type: 'order_status_change',
      order: doc.id,
      title: `Order ${doc.order_number} → ${doc.status}`,
      message: `Order ${doc.order_number} status changed to ${doc.status}.`,
      recipient: doc.assigned_staff ?? undefined,
    })
  }

  if (previousDoc?.payment_status !== doc.payment_status) {
    if (doc.payment_status === 'completed') {
      await notify(req, {
        type: 'payment_received',
        order: doc.id,
        title: `Payment received for ${doc.order_number}`,
        message: `Payment for order ${doc.order_number} was received.`,
      })
    } else if (doc.payment_status === 'failed') {
      await notify(req, {
        type: 'payment_failed',
        order: doc.id,
        title: `Payment failed for ${doc.order_number}`,
        message: `Payment for order ${doc.order_number} failed.`,
      })
    }
  }

  return doc
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'order_number',
  },
  hooks: {
    beforeChange: [generateOrderNumber, enforceStatusTransition, appendStatusHistory],
    afterChange: [notifyOrderEvents],
  },
  access: {
    read: isStaffOrOwn('customer'),
    create: ({ req: { user } }) => !user || user.collection === 'customers',
    update: isAdminManagerOrFulfillment,
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
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Ready', value: 'ready' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'status_change_note',
      type: 'text',
      admin: {
        description: 'Optional note for this status change. Saved to status history.',
      },
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
      access: {
        create: fieldIsAdminOrManager,
        update: fieldIsAdminOrManager,
      },
    },
    {
      name: 'cancellation_reason',
      type: 'text',
      access: {
        create: fieldIsAdminOrManager,
        update: fieldIsAdminOrManager,
      },
    },
    {
      name: 'customer_notes',
      type: 'textarea',
    },
  ],
}
