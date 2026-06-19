'use client'

import { useState } from 'react'

type FaqItem = { question: string; answer: string }

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={q} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className={`font-semibold text-sm sm:text-base ${open ? 'text-[#E67E22]' : 'text-gray-900'}`}>{q}</span>
        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-gray-600 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm divide-y divide-gray-200">
      {faqs.map((faq) => (
        <FaqRow key={faq.question} q={faq.question} a={faq.answer} />
      ))}
    </div>
  )
}
