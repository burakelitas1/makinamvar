'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Listing, MachineType } from '@/lib/types'
import { machineTypeLabels, statusLabels } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'

const MACHINE_TYPES: MachineType[] = ['abkant', 'giyotin', 'press', 'silindir', 'boru-bukum', 'testere']

const STATUS_TABS = [
  { key: '', label: 'Tümü' },
  { key: 'bekliyor', label: 'Bekliyor' },
  { key: 'teklif-verildi', label: 'Teklif Verildi' },
  { key: 'yanit-bekliyor', label: 'Yanıt Bekliyor' },
  { key: 'kabul', label: 'Kabul' },
  { key: 'red', label: 'Reddedildi' },
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
                ? 'bg-[#E67E22] text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-navy-700'}`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${status === tab.key ? 'bg-white/20' : 'bg-navy-700'}`}>
              {tab.key === '' ? counts.all : (counts[tab.key] ?? 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Arama + Filtre aç/kapat */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Ad, telefon, marka, model, il ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors
            ${filtersOpen || hasFilters
              ? 'bg-orange-500/10 border-orange-500 text-orange-400'
              : 'bg-navy-800 border-navy-700 text-gray-300 hover:bg-navy-700'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M10 12h4" />
          </svg>
          Filtrele
          {hasFilters && (
            <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[machineType, city, district, brand, dateFrom, dateTo].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filtre paneli */}
      {filtersOpen && (
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 mb-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Makine Türü */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Makine Türü</label>
            <select
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">Tümü</option>
              {MACHINE_TYPES.map((t) => (
                <option key={t} value={t}>{machineTypeLabels[t]}</option>
              ))}
            </select>
          </div>

          {/* Marka */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Marka</label>
            <input
              type="text"
              placeholder="örn. Trumpf, Baykal…"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              list="brand-list"
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
            <datalist id="brand-list">
              {brands.map((b) => <option key={b} value={b} />)}
            </datalist>
          </div>

          {/* İl */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">İl</label>
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); setDistrict('') }}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">Tüm İller</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* İlçe */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">İlçe</label>
            <input
              type="text"
              placeholder="İlçe ara…"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Tarih aralığı */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {hasFilters && (
            <div className="col-span-2 lg:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white underline transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sonuç sayısı */}
      <p className="text-gray-500 text-xs mb-3">
        {filtered.length} talep gösteriliyor{listings.length !== filtered.length ? ` (toplam ${listings.length})` : ''}
      </p>

      {/* Tablo */}
      {!filtered.length ? (
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
                <th className="px-4 py-3 font-medium">Marka / Model</th>
                <th className="px-4 py-3 font-medium">Konum</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {filtered.map((l) => (
                <tr key={l.id} className="bg-navy-900 hover:bg-navy-800 transition-colors">
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                    {machineTypeLabels[l.machine_type] ?? l.machine_type}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {l.brand}
                    <span className="text-gray-500 text-xs block">{l.model}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {l.location_city}
                    <span className="text-gray-500 text-xs block">{l.location_district}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {l.contact_name}
                    <span className="text-gray-500 text-xs block">{l.contact_phone}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/${l.id}`} className="text-[#E67E22] hover:text-orange-300 font-medium text-xs whitespace-nowrap">
                      İncele →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
