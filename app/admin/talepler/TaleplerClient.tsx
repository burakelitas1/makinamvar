'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Listing, MachineType } from '@/lib/types'
import { machineTypeLabels, statusLabels } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'

function getDuplicateReasons(listing: Listing, all: Listing[]): string[] {
  const others = all.filter((l) => l.id !== listing.id)
  const reasons: string[] = []
  if (others.some((l) => l.contact_phone === listing.contact_phone))
    reasons.push('Aynı telefon')
  if (others.some((l) => l.contact_name.trim().toLowerCase() === listing.contact_name.trim().toLowerCase()))
    reasons.push('Aynı isim')
  if (others.some((l) => l.machine_type === listing.machine_type && l.brand.toLowerCase() === listing.brand.toLowerCase()))
    reasons.push('Aynı makine')
  return reasons
}

const MACHINE_TYPES: MachineType[] = ['abkant', 'giyotin', 'press', 'silindir', 'boru-bukum', 'testere']

const STATUS_TABS = [
  { key: '', label: 'Tümü' },
  { key: 'bekliyor', label: 'Bekliyor' },
  { key: 'teklif-verildi', label: 'Teklif Verildi' },
  { key: 'yanit-bekliyor', label: 'Yanıt Bekliyor' },
  { key: 'kabul', label: 'Kabul' },
  { key: 'red', label: 'Reddedildi' },
  { key: 'satildi', label: 'Satıldı' },
]

interface Props {
  listings: Listing[]
  cities: string[]
  brands: string[]
}

export default function TaleplerClient({ listings, cities, brands }: Props) {
  const [status, setStatus] = useState('')
  const [machineType, setMachineType] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [brand, setBrand] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (status && l.status !== status) return false
      if (machineType && l.machine_type !== machineType) return false
      if (city && l.location_city !== city) return false
      if (district && !l.location_district.toLowerCase().includes(district.toLowerCase())) return false
      if (brand && !l.brand.toLowerCase().includes(brand.toLowerCase())) return false
      if (dateFrom && new Date(l.created_at) < new Date(dateFrom)) return false
      if (dateTo && new Date(l.created_at) > new Date(dateTo + 'T23:59:59')) return false
      if (search) {
        const s = search.toLowerCase()
        const match =
          l.contact_name.toLowerCase().includes(s) ||
          l.contact_phone.includes(s) ||
          l.brand.toLowerCase().includes(s) ||
          l.model.toLowerCase().includes(s) ||
          l.location_city.toLowerCase().includes(s)
        if (!match) return false
      }
      return true
    })
  }, [listings, status, machineType, city, district, brand, dateFrom, dateTo, search])

  const counts = useMemo(() => {
    const base = (s: string) => listings.filter((l) => l.status === s).length
    return {
      all: listings.length,
      bekliyor: base('bekliyor'),
      'teklif-verildi': base('teklif-verildi'),
      'yanit-bekliyor': base('yanit-bekliyor'),
      kabul: base('kabul'),
      red: base('red'),
    } as Record<string, number>
  }, [listings])

  const hasFilters = machineType || city || district || brand || dateFrom || dateTo

  function clearFilters() {
    setMachineType(''); setCity(''); setDistrict('')
    setBrand(''); setDateFrom(''); setDateTo('')
  }

  const inputCls = "w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB]/20"
  const labelCls = "text-xs text-[#475569] mb-1.5 block font-medium"

  return (
    <>
      {/* Durum tabları */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
              ${status === tab.key
                ? 'bg-[#3B5BDB] text-white shadow-sm'
                : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'}`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${status === tab.key ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
              {tab.key === '' ? counts.all : (counts[tab.key] ?? 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Arama + Filtre */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Ad, telefon, marka, model, il ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2 text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB]/20"
        />
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors
            ${filtersOpen || hasFilters
              ? 'bg-[#3B5BDB]/8 border-[#3B5BDB] text-[#3B5BDB]'
              : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M10 12h4" />
          </svg>
          Filtrele
          {hasFilters && (
            <span className="bg-[#3B5BDB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[machineType, city, district, brand, dateFrom, dateTo].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filtre paneli */}
      {filtersOpen && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 mb-5 grid grid-cols-2 lg:grid-cols-3 gap-4 shadow-sm">
          <div>
            <label className={labelCls}>Makine Türü</label>
            <select value={machineType} onChange={(e) => setMachineType(e.target.value)} className={inputCls}>
              <option value="">Tümü</option>
              {MACHINE_TYPES.map((t) => (
                <option key={t} value={t}>{machineTypeLabels[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Marka</label>
            <input type="text" placeholder="örn. Trumpf, Baykal…" value={brand} onChange={(e) => setBrand(e.target.value)} list="brand-list" className={inputCls} />
            <datalist id="brand-list">{brands.map((b) => <option key={b} value={b} />)}</datalist>
          </div>
          <div>
            <label className={labelCls}>İl</label>
            <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict('') }} className={inputCls}>
              <option value="">Tüm İller</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>İlçe</label>
            <input type="text" placeholder="İlçe ara…" value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Başlangıç Tarihi</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Bitiş Tarihi</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
          </div>
          {hasFilters && (
            <div className="col-span-2 lg:col-span-3 flex justify-end">
              <button onClick={clearFilters} className="text-sm text-[#475569] hover:text-[#0F172A] underline transition-colors">
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sonuç sayısı */}
      <p className="text-[#94A3B8] text-xs mb-3">
        {filtered.length} talep gösteriliyor{listings.length !== filtered.length ? ` (toplam ${listings.length})` : ''}
      </p>

      {/* Tablo */}
      {!filtered.length ? (
        <div className="bg-white rounded-xl text-center py-16 border border-[#E2E8F0]">
          <p className="text-[#94A3B8]">Bu filtreye ait talep bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-left border-b border-[#E2E8F0]">
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Makine</th>
                <th className="px-4 py-3 font-medium">Marka / Model</th>
                <th className="px-4 py-3 font-medium">Konum</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((l) => {
                const dupReasons = getDuplicateReasons(l, listings)
                const isDup = dupReasons.length > 0
                return (
                  <tr key={l.id} className={`hover:bg-[#F8FAFC] transition-colors ${isDup ? 'bg-amber-50' : 'bg-white'}`}>
                    <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-[#0F172A] font-medium whitespace-nowrap">
                      {machineTypeLabels[l.machine_type] ?? l.machine_type}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      {l.brand}
                      <span className="text-[#94A3B8] text-xs block">{l.model}</span>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      {l.location_city}
                      <span className="text-[#94A3B8] text-xs block">{l.location_district}</span>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      <div className="flex items-center gap-2">
                        <div>
                          {l.contact_name}
                          <span className="text-[#94A3B8] text-xs block">{l.contact_phone}</span>
                        </div>
                        {isDup && (
                          <span title={dupReasons.join(' · ')} className="flex-shrink-0 w-5 h-5 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                            !
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/${l.id}`} className="text-[#3B5BDB] hover:text-[#2F4AC7] font-medium text-xs whitespace-nowrap">
                        İncele →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
