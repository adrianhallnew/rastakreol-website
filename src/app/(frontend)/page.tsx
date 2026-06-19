import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-brand-ink">Rasta Kreol</h1>
      <p className="mt-4 text-brand-muted">Coming soon.</p>
      <Link
        href="/admin"
        className="mt-8 rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm"
      >
        Admin Panel
      </Link>
    </div>
  )
}
