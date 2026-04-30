'use client'

import { useState } from 'react'
import { machineTypeLabels, conditionLabels, statusLabels, sellReasonLabels } from '@/lib/types'
import type { Listing } from '@/lib/types'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/listings')
      const listings: Listing[] = await res.json()

      const rows = listings.map((l) => ({
        'Tarih': new Date(l.created_at).toLocaleDateString('tr-TR'),
        'Makine Türü': machineTypeLabels[l.machine_type],
        'Marka': l.brand,
        'Model': l.model,
        'Üretim Yılı': l.year,
        'Kapasite': l.capacity,
        'Durum': conditionLabels[l.condition],
        'Satış Nedeni': l.sell_reason ? (sellReasonLabels[l.sell_reason] ?? l.sell_reason) : '',
        'İl': l.location_city,
        'İlçe': l.location_district,
        'Ad Soyad': l.contact_name,
        'Telefon': l.contact_phone,
        'E-posta': l.contact_email,
        'Durum (Süreç)': statusLabels[l.status],
        'Teklif Fiyatı (TL)': l.offer_price ?? '',
        'Teklif Tarihi': l.offer_sent_at
          ? new Date(l.offer_sent_at).toLocaleDateString('tr-TR')
          : '',
        'Notlar': l.notes ?? '',
        'Fotoğraf Sayısı': l.photos?.length ?? 0,
      }))

      const { utils, writeFile } = await import('xlsx')
      const ws = utils.json_to_sheet(rows)

      // Sütun genişlikleri
      ws['!cols'] = [
        { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
        { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
        { wch: 16 }, { wch: 24 }, { wch: 16 }, { wch: 18 }, { wch: 14 },
        { wch: 30 }, { wch: 14 },
      ]

      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Talepler')

      const fileName = `makinebid-talepler-${new Date().toISOString().slice(0, 10)}.xlsx`
      writeFile(wb, fileName)
    } catch (e) {
      alert('Excel oluşturulurken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50
                 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {loading ? 'Hazırlanıyor…' : 'Excel İndir'}
    </button>
  )
}
