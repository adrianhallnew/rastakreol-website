interface StripeMotifProps {
  height?: 2 | 4
}

export function StripeMotif({ height = 4 }: StripeMotifProps) {
  return (
    <div
      className="flex w-full flex-none"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div className="flex-1 bg-brand-red" />
      <div className="flex-1 bg-brand-gold" />
      <div className="flex-1 bg-brand-green" />
      <div className="flex-1 bg-brand-teal" />
    </div>
  )
}
