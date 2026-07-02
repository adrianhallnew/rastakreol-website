import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        crop: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 800,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'full',
        width: 1200,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
  },
}
