'use client'

import { useEffect, useRef, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('sr-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const directionClass = {
    up: 'sr-up',
    left: 'sr-left',
    right: 'sr-right',
    none: 'sr-none',
  }[direction]

  return (
    <div ref={ref} className={`sr-base ${directionClass} ${className}`}>
      {children}
    </div>
  )
}
