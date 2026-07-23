'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  href: string
  className?: string
  children: ReactNode
  event?: string
}

export default function CtaTrack({ href, className, children, event = 'primary_cta_click' }: Props) {
  function handleClick() {
    if (typeof window !== 'undefined') {
      const w = window as unknown as { dataLayer?: object[] }
      if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event })
    }
  }
  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
