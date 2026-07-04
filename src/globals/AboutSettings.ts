import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '../lib/access'

export const AboutSettings: GlobalConfig = {
  slug: 'about-settings',
  label: 'About Page',
  access: {
    read: () => true,
    update: isAdminOrManager,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
