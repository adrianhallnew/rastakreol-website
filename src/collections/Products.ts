import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { isAdmin, isAdminOrManager } from '../lib/access'
import { checkLowStockAndNotify } from '../hooks/notify'

const notifyLowStock: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== 'update' || !previousDoc) return doc

  const prevVariants: Array<{ sku: string; stock: number }> = previousDoc.variants ?? []

  for (const variant of doc.variants ?? []) {
    const prev = prevVariants.find((v) => v.sku === variant.sku)
    if (!prev || variant.stock >= prev.stock) continue

    await checkLowStockAndNotify(req, {
      productId: doc.id,
      variantSku: variant.sku,
      size: variant.size,
      previousStock: prev.stock,
      newStock: variant.stock,
      thresholdOverride: variant.low_stock_threshold,
    })
  }

  return doc
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [notifyLowStock],
  },
  access: {
    // Staff (users collection) see everything, including drafts/archived — everyone
    // else (customers, guests) only sees published. Previously checked `!!user` alone,
    // which let any logged-in *customer* see drafts/archived too, not just staff.
    read: ({ req: { user } }) =>
      user && user.collection === 'users' ? true : { status: { equals: 'published' } },
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
      name: 'sale_price',
      type: 'number',
      admin: {
        description: 'Only shown when On Sale is checked.',
      },
    },
    {
      name: 'on_sale',
      type: 'checkbox',
      defaultValue: false,
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
        {
          name: 'low_stock_threshold',
          type: 'number',
          admin: {
            description: 'Leave blank to use the site-wide default.',
          },
        },
      ],
    },
  ],
}
