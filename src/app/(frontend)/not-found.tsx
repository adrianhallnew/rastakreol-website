import { EmptyState } from '../../components/ui/EmptyState'

export default function NotFound() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <EmptyState
        heading="Page not found"
        body="This page may have moved or no longer exists."
        ctaLabel="Continue shopping"
        ctaHref="/shop"
      />
    </div>
  )
}
