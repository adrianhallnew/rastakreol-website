'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { setCustomerCookie, clearCustomerCookie } from '../../../lib/auth/set-customer-cookie'

type ActionResult = { success: true } | { success: false; error: string }

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!name || !email || !password) {
    return { success: false, error: 'All fields are required.' }
  }

  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'customers',
      data: { name, email, password },
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Registration failed.' }
  }
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  const payload = await getPayload({ config })

  try {
    const result = await payload.login({
      collection: 'customers',
      data: { email, password },
    })

    if (!result.token) {
      return { success: false, error: 'Login failed.' }
    }

    await setCustomerCookie(result.token)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Invalid email or password.' }
  }
}

export async function logoutAction(): Promise<void> {
  await clearCustomerCookie()
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token) return { success: false, error: 'Missing verification token.' }

  const payload = await getPayload({ config })

  try {
    const verified = await payload.verifyEmail({ collection: 'customers', token })
    if (!verified) return { success: false, error: 'Verification failed.' }
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Verification failed.' }
  }
}

export async function requestPasswordResetAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '')
  if (!email) return { success: false, error: 'Email is required.' }

  const payload = await getPayload({ config })

  try {
    await payload.forgotPassword({ collection: 'customers', data: { email } })
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Request failed.' }
  }
}

export async function resetPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const token = String(formData.get('token') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!token || !password) {
    return { success: false, error: 'Missing token or password.' }
  }

  const payload = await getPayload({ config })

  try {
    const result = await payload.resetPassword({
      collection: 'customers',
      data: { token, password },
      overrideAccess: true,
    })

    if (result.token) {
      await setCustomerCookie(result.token)
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Reset failed.' }
  }
}
