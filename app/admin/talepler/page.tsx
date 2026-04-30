import { createServiceClient } from '@/lib/supabase-server'
import type { Listing } from '@/lib/types'
import { machineTypeLabels } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import ExportButton from '@/components/ExportButton'
import Link from 'next/link'

export const revalidate = 0

export default async function TaleplerPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServiceClient()
  let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
  if (searchParams.status) query = query.eq('status', searchParams.status)
  const { data: listings, error } = await query

  if (error) return <div className="text-red-400">Veri yüklenemedi: {error.message}</div>

  const counts = {
    all: listings?.length ?? 0,
    bekliyor: listings?.filter((l) => l.status === 'bekliyor').length ?? 0,
    'teklif-verildi': listings?.filter((l) => l.status === 'teklif-verildi').length ?? 0,
    kabul: listings?.filter((l) => l.status === 'kabul').length ?? 0,
    red: listings?.filter((l) => l.status === 'red').length ?? 0,
  }

  const TABS = [
    { key: '', label: 'Tümü', count: counts.all },
    { key: 'bekliyor', label: 'Bekliyor', count: counts.bekliyor },
    { key: 'teklif-verildi', label: 'Teklif Verildi', count: counts['teklif-verildi'] },
    { key: 'kabul', label: 'Kabul', count: counts.kabul },
    { key: 'red', label: 'Reddedildi', count: counts.red },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Talepler</h1>
          <p className="text-gray-400 text-sm mt-1">Tüm makine satış başvuruları</p>
        </div>
        <ExportButton />
      </div>

      {/* Filtre */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key ? `/admin/talepler?status=${tab.key}` : '/admin/talepler'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
              ${(searchParams.status ?? '') === tab.key
                ? 'bg-[#E67E22] text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-navy-700'}`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${(searchParams.status ?? '') === tab.key ? 'bg-white/20' : 'bg-navy-700'}`}>
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {!listings?.length ? (
        <div className="bg-navy-900 rounded-xl text-center py-16 border border-navy-700">
          <p className="text-gray-400">Bu filtreye ait talep bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-800 text-gray-400 text-left">
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Makine</th>
                <th className="px-4 py-3 font-medium">Marka</th>
                <th className="px-4 py-3 font-medium">Konum</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {(listings as Listing[]).map((l) => (
                <tr key={l.id} className="bg-navy-900 hover:bg-navy-800 transition-colors">
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">
                    {machineTypeLabels[l.machine_type] ?? l.machine_type}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{l.brand}</td>
                  <td className="px-4 py-3 text-gray-400">{l.location_city}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {l.contact_name}
                    <br />
                    <span className="text-gray-500 text-xs">{l.contact_phone}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/${l.id}`} className="text-[#E67E22] hover:text-orange-300 font-medium text-xs">
                      İncele →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
