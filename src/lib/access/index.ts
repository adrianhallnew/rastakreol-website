import type { Access } from 'payload'
import type { User } from '../../payload-types'

// Customers have no role field — only staff (users collection) do.
const staffRole = (user: NonNullable<Parameters<Access>[0]['req']['user']>): string =>
  user.collection === 'users' ? ((user as User).role ?? '') : ''

export const isAdmin: Access = ({ req: { user } }) =>
  !!user && staffRole(user) === 'admin'

export const isAdminOrManager: Access = ({ req: { user } }) =>
  !!user && ['admin', 'manager'].includes(staffRole(user))

export const isAdminOrSupport: Access = ({ req: { user } }) =>
  !!user && ['admin', 'support'].includes(staffRole(user))

export const isStaff: Access = ({ req: { user } }) =>
  !!user && ['admin', 'manager', 'fulfillment', 'support'].includes(staffRole(user))

// For collections where staff sees all, but customers/guests see only their own records.
// Returns `true` for staff, a where-clause for customers, and `false` for unauthenticated.
export const isStaffOrOwn =
  (customerField: string): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (user.collection === 'users') return true
    if (user.collection === 'customers') return { [customerField]: { equals: user.id } }
    return false
  }
