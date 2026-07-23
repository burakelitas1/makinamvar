import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const revalidate = 0

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  const w = 120
  const h = 36
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" points={points} />
    </svg>
  )
}

export default async function AdminDashboard() {
  const supabase = createServiceClient()
  const { data: listings } = await supabase.from('listings').select('status, created_at')

  const now = new Date()
  const total = listings?.length ?? 0
  const bekliyor = listings?.filter((l) => l.status === 'bekliyor').length ?? 0
  const teklif = listings?.filter((l) => l.status === 'teklif-verildi').length ?? 0
  const yanitBekliyor = listings?.filter((l) => l.status === 'yanit-bekliyor').length ?? 0
  const kabul = listings?.filter((l) => l.status === 'kabul').length ?? 0
  const red = listings?.filter((l) => l.status === 'red').length ?? 0

  const bugun = listings?.filter((l) => {
    const d = new Date(l.created_at)
    return d.toDateString() === now.toDateString()
  }).length ?? 0

  // Son 7 gün günlük talep sayıları
  const son7Gun = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' })
    const count = listings?.filter((l) => new Date(l.created_at).toDateString() === d.toDateString()).length ?? 0
    return { label, count }
  })

  // Son 30 gün
  const son30Gun = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (29 - i))
    return listings?.filter((l) => new Date(l.created_at).toDateString() === d.toDateString()).length ?? 0
  })

  const toplumTeklif = teklif + yanitBekliyor + kabul + red
  const donusumOrani = toplumTeklif > 0 ? Math.round((kabul / toplumTeklif) * 100) : 0
  const kabulRedToplam = kabul + red
  const kabulOrani = kabulRedToplam > 0 ? Math.round((kabul / kabulRedToplam) * 100) : 0

  const SHORTCUTS = [
    { href: '/admin/talepler', icon: '📋', label: 'Talepleri Yönet', desc: 'Gelen başvuruları incele, teklif gönder' },
    { href: '/admin/referanslar', icon: '💬', label: 'Referanslar', desc: 'Müşteri yorumlarını düzenle' },
    { href: '/admin/sss', icon: '❓', label: 'SSS', desc: 'Sık sorulan soruları güncelle' },
    { href: '/admin/ayarlar', icon: '⚙️', label: 'Site Ayarları', desc: 'İletişim, hero ve diğer içerikler' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-[#475569] text-sm mb-8">Hoş geldiniz. Güncel istatistikler aşağıda.</p>

      {/* Ana istatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <p className="text-4xl font-black text-white">{total}</p>
          <p className="text-[#475569] text-xs mt-1">Toplam Talep</p>
          <p className="text-[#3B5BDB] text-xs mt-2 font-semibold">+{bugun} bugün</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <p className="text-4xl font-black text-yellow-400">{bekliyor}</p>
          <p className="text-[#475569] text-xs mt-1">Bekliyor</p>
          <p className="text-[#475569] text-xs mt-2">İşlem bekleyen</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <p className="text-4xl font-black text-green-400">{kabul}</p>
          <p className="text-[#475569] text-xs mt-1">Kabul Edildi</p>
          <p className="text-[#475569] text-xs mt-2">{kabulOrani}% kabul oranı</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <p className="text-4xl font-black text-[#3B5BDB]">{donusumOrani}%</p>
          <p className="text-[#475569] text-xs mt-1">Dönüşüm Oranı</p>
          <p className="text-[#475569] text-xs mt-2">Teklif → Kabul</p>
        </div>
      </div>

      {/* Durum dağılımı + Trend */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">

        {/* Durum dağılımı */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wider mb-4">Durum Dağılımı</h2>
          <div className="space-y-3">
            {[
              { label: 'Bekliyor', value: bekliyor, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
              { label: 'Teklif Verildi', value: teklif, color: 'bg-blue-400', textColor: 'text-blue-400' },
              { label: 'Yanıt Bekliyor', value: yanitBekliyor, color: 'bg-purple-400', textColor: 'text-purple-400' },
              { label: 'Kabul Edildi', value: kabul, color: 'bg-green-400', textColor: 'text-green-400' },
              { label: 'Reddedildi', value: red, color: 'bg-red-400', textColor: 'text-red-400' },
            ].map(({ label, value, color, textColor }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">{label}</span>
                  <span className={`font-bold ${textColor}`}>{value}</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${color}`}
                    style={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son 30 gün trend */}
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wider mb-4">Son 30 Gün Trendi</h2>
          <div className="flex items-end justify-center mb-4">
            <Sparkline data={son30Gun} color="#E67E22" />
          </div>
          <div className="grid grid-cols-7 gap-1 mt-2">
            {son7Gun.map(({ label, count }) => (
              <div key={label} className="text-center">
                <div
                  className="bg-[#E67E22] rounded-sm mx-auto mb-1 transition-all"
                  style={{ height: `${Math.max((count / Math.max(...son7Gun.map(d => d.count), 1)) * 48, count > 0 ? 4 : 2)}px`, width: '100%', opacity: count > 0 ? 1 : 0.2 }}
                />
                <p className="text-[#475569] text-[9px] leading-tight">{label}</p>
                <p className="text-white text-[10px] font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı erişim */}
      <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wider mb-4">Hızlı Erişim</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#E67E22] transition-colors group"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <p className="text-white font-semibold text-sm group-hover:text-[#3B5BDB] transition-colors">{s.label}</p>
            <p className="text-[#475569] text-xs mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
