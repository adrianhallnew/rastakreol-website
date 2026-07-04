'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

type ActionResult = { success: true } | { success: false; error: string }

export async function submitContactAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const subject = String(formData.get('subject') ?? '')
  const message = String(formData.get('message') ?? '')

  if (!name || !email || !subject || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, subject, message },
      overrideAccess: true,
    })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Could not submit your message.' }
  }

  // Best-effort — a failed email send shouldn't fail the submission, it's already saved.
  try {
    const siteSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
    if (siteSettings.contact_email) {
      await payload.sendEmail({
        to: siteSettings.contact_email,
        subject: `New contact form: ${subject}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`,
      })
    }
  } catch {
    // Submission is already saved — the admin can still see it in Payload regardless of email delivery.
  }

  return { success: true }
}
