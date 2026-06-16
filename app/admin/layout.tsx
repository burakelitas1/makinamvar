import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Admin — Trink Makina' }

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/talepler', label: 'Talepler', icon: '📋' },
  { href: '/admin/referanslar', label: 'Referanslar', icon: '💬' },
  { href: '/admin/sss', label: 'SSS', icon: '❓' },
  { href: '/admin/ayarlar', label: 'Site Ayarları', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-navy-900 border-r border-navy-700 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E67E22] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs">TM</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Trink Makina</p>
              <p className="text-gray-500 text-xs">Admin Paneli</p>
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Logout */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
