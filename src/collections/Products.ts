import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrManager } from '../lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: 'published' } },
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
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in whole SCR (e.g. 450 = SCR 450).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'select',
          required: true,
          options: [
            { label: 'XS', value: 'XS' },
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
            { label: 'L', value: 'L' },
            { label: 'XL', value: 'XL' },
            { label: 'XXL', value: 'XXL' },
          ],
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
        },
        {
          name: 'stock',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'price_override',
          type: 'number',
          admin: {
            description: 'Leave blank to use the product price.',
          },
        },
      ],
    },
  ],
}
