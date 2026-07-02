import type { CollectionConfig } from 'payload'
import { isAdmin, isStaffOrOwn } from '../lib/access'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isStaffOrOwn('id'),
    create: () => true,
    update: isStaffOrOwn('id'),
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'google_id',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Set automatically by Google OAuth — do not edit manually.',
      },
    },
    {
      name: 'email_verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'address_line1',
      type: 'text',
    },
    {
      name: 'address_line2',
      type: 'text',
    },
    {
      name: 'district',
      type: 'text',
      admin: {
        description: 'E.g. Victoria, Grand Anse, Beau Vallon',
      },
    },
    {
      name: 'island',
      type: 'select',
      options: [
        { label: 'Mahé', value: 'mahe' },
        { label: 'Praslin', value: 'praslin' },
        { label: 'La Digue', value: 'la_digue' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
}
