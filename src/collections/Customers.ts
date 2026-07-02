import type { CollectionConfig } from 'payload'
import { isAdmin, isStaffOrOwn } from '../lib/access'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    useSessions: false,
    verify: {
      generateEmailHTML: ({ token }) =>
        `<p>Welcome to Rasta Kreol. Click below to verify your email address:</p>
        <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/account/verify-email?token=${token}">Verify my email</a></p>`,
      generateEmailSubject: () => 'Verify your Rasta Kreol account',
    },
    forgotPassword: {
      generateEmailHTML: ({ token } = {}) =>
        `<p>Click below to reset your Rasta Kreol password. This link expires in 1 hour.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/account/reset-password/confirm?token=${token}">Reset my password</a></p>`,
      generateEmailSubject: () => 'Reset your Rasta Kreol password',
    },
  },
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
