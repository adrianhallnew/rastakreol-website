import type { Metadata } from 'next'
import { RegisterForm } from './register-form'

export const metadata: Metadata = { title: 'Register' }

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">Create an account</h1>
      <RegisterForm />
    </div>
  )
}
