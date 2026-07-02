import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrManager } from '../lib/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier. Used in /shop?category=[slug].',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sort_order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
