'use client'

import { useState } from 'react'
import { machineTypeLabels, conditionLabels, statusLabels, sellReasonLabels } from '@/lib/types'
import type { Listing } from '@/lib/types'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/listings')
      let listings: Listing[] = await res.json()

      if (startDate) {
        listings = listings.filter((l) => new Date(l.created_at) >= new Date(startDate))
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        listings = listings.filter((l) => new Date(l.created_at) <= end)
      }

      const rows = listings.map((l) => ({
        'Tarih': new Date(l.created_at).toLocaleDateString('tr-TR'),
        'Makine Türü': machineTypeLabels[l.machine_type] ?? l.machine_type,
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
        'Teklif Tarihi': l.offer_sent_at ? new Date(l.offer_sent_at).toLocaleDateString('tr-TR') : '',
        'Müşteri Yanıtı': l.customer_response ?? '',
        'Karşı Teklif (TL)': l.counter_offer_price ?? '',
        'Notlar': l.notes ?? '',
        'Fotoğraf Sayısı': l.photos?.length ?? 0,
      }))

      const { utils, writeFile } = await import('xlsx')
      const ws = utils.json_to_sheet(rows)
      ws['!cols'] = [
        { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
        { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 12 }, { wch: 14 },
        { wch: 20 }, { wch: 16 }, { wch: 24 }, { wch: 16 }, { wch: 18 },
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 30 }, { wch: 12 },
      ]
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Talepler')

      const dateStr = startDate && endDate
        ? `${startDate}_${endDate}`
        : new Date().toISOString().slice(0, 10)
      writeFile(wb, `trink-talepler-${dateStr}.xlsx`)
      setShowModal(false)
    } catch {
      alert('Excel oluşturulurken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Excel İndir
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-1">Excel İndir</h2>
            <p className="text-gray-400 text-sm mb-5">Tarih aralığı seçin (boş bırakırsanız tüm talepler indirilir)</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Başlangıç Tarihi</label>
                <input
                  type="date"
                  className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E67E22]"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bitiş Tarihi</label>
                <input
                  type="date"
                  className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E67E22]"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-navy-600 text-gray-400 hover:text-white py-2 rounded-lg text-sm transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Hazırlanıyor…' : 'İndir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
