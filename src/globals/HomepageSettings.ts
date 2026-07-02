import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '../lib/access'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage',
  access: {
    read: () => true,
    update: isAdminOrManager,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'headline',
          type: 'text',
        },
        {
          name: 'cta_label',
          type: 'text',
          defaultValue: 'Shop tees',
        },
        {
          name: 'cta_link',
          type: 'text',
          defaultValue: '/shop',
        },
      ],
    },
    {
      name: 'featured_products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 4,
    },
    {
      name: 'sections',
      type: 'group',
      fields: [
        {
          name: 'show_featured',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'show_brand_story',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
