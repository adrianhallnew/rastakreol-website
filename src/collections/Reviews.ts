import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { isAdmin, isAdminOrManager } from '../lib/access'
import { notify } from '../hooks/notify'

const notifyNewReview: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  await notify(req, {
    type: 'new_review',
    product: doc.product,
    title: `New review: ${doc.title}`,
    message: `A new ${doc.rating}-star review was submitted and needs moderation.`,
  })

  return doc
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [notifyNewReview],
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
