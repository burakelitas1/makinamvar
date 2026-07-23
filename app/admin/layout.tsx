'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',             label: 'Dashboard',   icon: '📊' },
  { href: '/admin/talepler',    label: 'Talepler',    icon: '📋' },
  { href: '/admin/blog',        label: 'Blog',        icon: '📝' },
  { href: '/admin/referanslar', label: 'Referanslar', icon: '💬' },
  { href: '/admin/sss',         label: 'SSS',         icon: '❓' },
  { href: '/admin/ayarlar',     label: 'Ayarlar',     icon: '⚙️' },
]

const INACTIVITY_MS = 60 * 60 * 1000

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        router.push('/admin/login')
      }, INACTIVITY_MS)
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, resetTimer))
    }
  }, [router])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full bg-[#0F172A] flex-col z-40 transition-all duration-300 ${open ? 'w-56' : 'w-16'}`}>
        {/* Logo + toggle */}
        <div className="px-3 py-4 border-b border-white/10 flex items-center justify-between">
          {open && (
            <div className="flex items-center gap-2 overflow-hidden">
              <Image src="/logo-icon.svg" alt="Trink Makina" width={28} height={28} className="flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">Trink Makina</p>
                <p className="text-[#64748B] text-xs whitespace-nowrap">Admin Paneli</p>
              </div>
            </div>
          )}
          {!open && <Image src="/logo-icon.svg" alt="Trink Makina" width={28} height={28} className="mx-auto" />}
          <button
            onClick={() => setOpen(!open)}
            className={`text-[#64748B] hover:text-white transition-colors flex-shrink-0 ${!open ? 'mx-auto mt-2' : ''}`}
            aria-label="Menüyü aç/kapat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={!open ? item.label : undefined}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${!open ? 'justify-center' : ''}
                ${isActive(item.href)
                  ? 'bg-[#3B5BDB] text-white'
                  : 'text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {open && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            title={!open ? 'Siteyi Gör' : undefined}
            className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/10 transition-colors text-sm ${!open ? 'justify-center' : ''}`}
          >
            <span className="text-lg flex-shrink-0">🌐</span>
            {open && <span className="whitespace-nowrap">Siteyi Gör</span>}
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              title={!open ? 'Çıkış Yap' : undefined}
              className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-white/5 transition-colors text-sm ${!open ? 'justify-center' : ''}`}
            >
              <span className="text-lg flex-shrink-0">🚪</span>
              {open && <span className="whitespace-nowrap">Çıkış Yap</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F172A] border-b border-white/10 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="Trink Makina" width={28} height={28} />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Trink Makina</p>
            <p className="text-[#64748B] text-[10px]">Admin Paneli</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-[#64748B] hover:text-white text-lg">🌐</Link>
          <form action="/api/admin/logout" method="POST">
            <button className="text-[#64748B] hover:text-red-400 text-lg">🚪</button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <div className={`lg:transition-all lg:duration-300 ${open ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <main className="min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0 px-4 py-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-white/10 z-40">
        <div className="flex items-center justify-around h-16">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 transition-colors min-w-[56px]
                ${isActive(item.href) ? 'text-[#3B5BDB]' : 'text-[#64748B] hover:text-white'}`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

    </div>
  )
}
