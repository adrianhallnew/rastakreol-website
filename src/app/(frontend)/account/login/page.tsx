import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Log in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">Log in</h1>
      <LoginForm redirectTo={redirect ?? '/account'} />
    </div>
  )
}
