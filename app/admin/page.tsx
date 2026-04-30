import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = createServiceClient()
  const { data: listings } = await supabase.from('listings').select('status, created_at')

  const total = listings?.length ?? 0
  const bekliyor = listings?.filter((l) => l.status === 'bekliyor').length ?? 0
  const teklif = listings?.filter((l) => l.status === 'teklif-verildi').length ?? 0
  const kabul = listings?.filter((l) => l.status === 'kabul').length ?? 0
  const red = listings?.filter((l) => l.status === 'red').length ?? 0

  const bugun = listings?.filter((l) => {
    const d = new Date(l.created_at)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length ?? 0

  const STATS = [
    { label: 'Toplam Talep', value: total, color: 'border-gray-700', text: 'text-white' },
    { label: 'Bugün Gelen', value: bugun, color: 'border-[#E67E22]', text: 'text-[#E67E22]' },
    { label: 'Bekliyor', value: bekliyor, color: 'border-yellow-500', text: 'text-yellow-400' },
    { label: 'Teklif Verildi', value: teklif, color: 'border-blue-500', text: 'text-blue-400' },
    { label: 'Kabul', value: kabul, color: 'border-green-500', text: 'text-green-400' },
    { label: 'Reddedildi', value: red, color: 'border-red-500', text: 'text-red-400' },
  ]

  const SHORTCUTS = [
    { href: '/admin/talepler', icon: '📋', label: 'Talepleri Yönet', desc: 'Gelen başvuruları incele, teklif gönder' },
    { href: '/admin/referanslar', icon: '💬', label: 'Referanslar', desc: 'Müşteri yorumlarını düzenle' },
    { href: '/admin/sss', icon: '❓', label: 'SSS', desc: 'Sık sorulan soruları güncelle' },
    { href: '/admin/ayarlar', icon: '⚙️', label: 'Site Ayarları', desc: 'İletişim, hero ve diğer içerikler' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Hoş geldiniz. Aşağıdan yönetmek istediğiniz bölümü seçin.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className={`bg-navy-900 rounded-xl p-4 border-l-4 ${s.color}`}>
            <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Hızlı Erişim</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-navy-900 border border-navy-700 rounded-xl p-5 hover:border-[#E67E22] transition-colors group"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <p className="text-white font-semibold text-sm group-hover:text-[#E67E22] transition-colors">{s.label}</p>
            <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
