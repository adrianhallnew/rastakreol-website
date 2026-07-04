'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import Image from 'next/image'
import { cn } from '../../lib/cn'

interface GalleryImage {
  url: string
  alt: string
}

interface PDPGalleryProps {
  images: GalleryImage[]
  productName: string
}

const SWIPE_THRESHOLD_PX = 40

export function PDPGallery({ images, productName }: PDPGalleryProps) {
  const [active, setActive] = useState(0)
  const startX = useRef<number | null>(null)
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (images.length === 0) {
    return <div className="aspect-[4/5] w-full bg-brand-paper" aria-hidden="true" />
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current == null) return
    const delta = e.clientX - startX.current
    startX.current = null
    if (delta > SWIPE_THRESHOLD_PX) setActive((i) => Math.max(0, i - 1))
    else if (delta < -SWIPE_THRESHOLD_PX) setActive((i) => Math.min(images.length - 1, i + 1))
  }

  const handleDotsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const next = (active + delta + images.length) % images.length
    setActive(next)
    dotRefs.current[next]?.focus()
  }

  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden bg-brand-paper"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <Image
          src={images[active].url}
          alt={images[active].alt || productName}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="mt-2 flex justify-center"
          role="tablist"
          aria-label="Product images"
          onKeyDown={handleDotsKeyDown}
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              ref={(el) => {
                dotRefs.current[i] = el
              }}
              type="button"
              role="tab"
              tabIndex={i === active ? 0 : -1}
              aria-selected={i === active}
              aria-label={`Image ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className={cn('h-2 w-2 rounded-full', i === active ? 'bg-brand-ink' : 'bg-brand-border')} />
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-3 hidden gap-2 md:flex">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 flex-none overflow-hidden rounded-sm border',
                i === active ? 'border-brand-ink' : 'border-brand-border',
              )}
            >
              <Image src={img.url} alt="" fill unoptimized sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
