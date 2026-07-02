import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdminOrManager,
  },
  fields: [
    {
      name: 'store_name',
      type: 'text',
      defaultValue: 'Rasta Kreol',
    },
    {
      name: 'contact_email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'instagram_url',
      type: 'text',
    },
    {
      name: 'facebook_url',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'low_stock_threshold',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Show "Only X left" badge when variant stock falls below this number.',
      },
    },
    {
      name: 'announcement',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}
