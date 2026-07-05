import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Rasta Kreol.',
}

const faqs = [
  {
    question: 'Is online payment available?',
    answer:
      'Online payment isn’t connected yet. You can place an order now and we’ll be in touch about payment directly once it’s confirmed.',
  },
  {
    question: 'Where do you deliver?',
    answer: 'We currently deliver locally within Seychelles only.',
  },
  {
    question: 'How do I know my size?',
    answer:
      'Each product page lists the available sizes and current stock for that size. If you’re unsure, feel free to contact us before ordering.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'See our Returns & Cancellations page for details.',
  },
]

export default function FaqPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">FAQ</h1>
      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h2 className="font-display text-lg font-semibold text-brand-ink">{faq.question}</h2>
            <p className="mt-1 max-w-md text-brand-muted">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
