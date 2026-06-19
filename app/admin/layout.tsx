import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Admin — Trink Makina' }

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/talepler', label: 'Talepler', icon: '📋' },
  { href: '/admin/referanslar', label: 'Referanslar', icon: '💬' },
  { href: '/admin/sss', label: 'SSS', icon: '❓' },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-navy-900 border-r border-navy-700 flex-col z-40">
        <div className="px-5 py-5 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.svg" alt="Trink Makina" width={32} height={32} />
            <div>
              <p className="text-white font-bold text-sm leading-tight">Trink Makina</p>
              <p className="text-gray-500 text-xs">Admin Paneli</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-navy-800 hover:text-white transition-colors text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-navy-700">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors text-sm mb-1"
          >
            <span>🌐</span> Siteyi Gör
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors text-sm">
              <span>🚪</span> Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-navy-900 border-b border-navy-700 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="Trink Makina" width={28} height={28} />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Trink Makina</p>
            <p className="text-gray-500 text-[10px]">Admin Paneli</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-gray-500 hover:text-gray-300 text-xs">🌐</Link>
          <form action="/api/admin/logout" method="POST">
            <button className="text-gray-500 hover:text-red-400 text-xs">🚪</button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <div className="lg:ml-56">
        <main className="min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0 px-4 py-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-navy-700 z-40">
        <div className="flex items-center justify-around h-16">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-2 text-gray-400 hover:text-white transition-colors min-w-[56px]"
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
