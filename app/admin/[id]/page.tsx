'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Listing } from '@/lib/types'
import { machineTypeLabels, conditionLabels, statusLabels, sellReasonLabels, statusColors } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [duplicates, setDuplicates] = useState<Listing[]>([])
  const [offerPrice, setOfferPrice] = useState('')
  const [offerNotes, setOfferNotes] = useState('')
  const [offerSending, setOfferSending] = useState(false)
  const [offerMsg, setOfferMsg] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const infoCardRef = useRef<HTMLDivElement>(null)

  async function downloadInfoCard() {
    if (!infoCardRef.current || !listing) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(infoCardRef.current, { backgroundColor: '#ffffff', scale: 2 })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${listing.brand}-${listing.model || listing.machine_type}-bilgi.png`
    a.click()
  }

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setListing(d)
        setLoading(false)
        // Duplicate check
        fetch('/api/listings')
          .then((r) => r.json())
          .then((all: Listing[]) => {
            const dups = all.filter((l) =>
              l.id !== d.id && (
                l.contact_phone === d.contact_phone ||
                l.contact_name.trim().toLowerCase() === d.contact_name.trim().toLowerCase() ||
                (l.machine_type === d.machine_type && l.brand.toLowerCase() === d.brand.toLowerCase())
              )
            )
            setDuplicates(dups)
          })
      })
      .catch(() => setLoading(false))
  }, [id])

  async function sendOffer() {
    if (!offerPrice || isNaN(Number(offerPrice))) {
      setOfferMsg('Geçerli bir fiyat giriniz')
      return
    }
    setOfferSending(true)
    setOfferMsg('')
    const res = await fetch(`/api/listings/${id}/offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: Number(offerPrice), notes: offerNotes }),
    })
    if (res.ok) {
      setOfferMsg('Teklif başarıyla gönderildi!')
      const updated = await fetch(`/api/listings/${id}`).then((r) => r.json())
      setListing(updated)
      router.refresh()
    } else {
      const j = await res.json()
      setOfferMsg(j.error ?? 'Hata oluştu')
    }
    setOfferSending(false)
  }

  async function downloadPhoto(url: string, index: number) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const ext = blob.type.includes('png') ? 'png' : 'jpg'
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${listing?.brand ?? 'makine'}-${listing?.model ?? ''}-foto${index + 1}.${ext}`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      alert('Fotoğraf indirilemedi.')
    }
  }

  async function downloadAllPhotos(urls: string[]) {
    for (let i = 0; i < urls.length; i++) {
      await downloadPhoto(urls[i], i)
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 400))
    }
  }

  async function updateStatus(status: string) {
    setStatusUpdating(true)
    await fetch(`/api/listings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const updated = await fetch(`/api/listings/${id}`).then((r) => r.json())
    setListing(updated)
    setStatusUpdating(false)
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="text-center py-16">
        <p className="text-[#64748B]">Talep bulunamadı.</p>
        <Link href="/admin" className="text-[#3B5BDB] hover:underline mt-4 inline-block">← Geri Dön</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-[#64748B] hover:text-white transition-colors text-sm">
          ← Tüm Talepler
        </Link>
        <span className="text-white">/</span>
        <span className="text-[#475569] text-sm">
          {listing.brand} {listing.model}
        </span>
      </div>


      {/* Duplikat uyarısı */}
      {duplicates.length > 0 && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-yellow-300 font-semibold text-sm mb-2">
                Bu talep ile benzer {duplicates.length} kayıt bulundu
              </p>
              <div className="space-y-1.5">
                {duplicates.map((d) => {
                  const reasons = []
                  if (d.contact_phone === listing.contact_phone) reasons.push('aynı telefon')
                  if (d.contact_name.trim().toLowerCase() === listing.contact_name.trim().toLowerCase()) reasons.push('aynı isim')
                  if (d.machine_type === listing.machine_type && d.brand.toLowerCase() === listing.brand.toLowerCase()) reasons.push('aynı makine')
                  return (
                    <div key={d.id} className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-500">{reasons.join(', ')}</span>
                      <span className="text-[#94A3B8]">—</span>
                      <Link href={`/admin/${d.id}`} className="text-yellow-400 hover:text-yellow-300 underline">
                        {d.contact_name} · {d.brand} {d.model} · {new Date(d.created_at).toLocaleDateString('tr-TR')}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol kolon: Detaylar */}
        <div className="lg:col-span-2 space-y-6">

          {/* Fotoğraflar */}
          {listing.photos.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Fotoğraflar</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadPhoto(listing.photos[activePhoto], activePhoto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#475569] hover:text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    ⬇ İndir
                  </button>
                  {listing.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => downloadAllPhotos(listing.photos)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#475569] hover:text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      ⬇ Tümünü İndir ({listing.photos.length})
                    </button>
                  )}
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-white mb-3">
                <Image
                  src={listing.photos[activePhoto]}
                  alt="Makine fotoğrafı"
                  fill
                  className="object-contain"
                />
              </div>
              {listing.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.photos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors
                        ${activePhoto === i ? 'border-[#3B5BDB]' : 'border-[#E2E8F0]'}`}
                    >
                      <Image src={url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Makine Bilgileri */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Makine Bilgileri</h2>
              <button type="button" onClick={downloadInfoCard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#475569] hover:text-white text-xs font-medium rounded-lg transition-colors">
                ⬇ Bilgi Kartı İndir
              </button>
            </div>
            <div ref={infoCardRef} className="bg-white p-2 rounded-lg">
            <dl className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tür', value: (machineTypeLabels as Record<string, string>)[listing.machine_type] ?? listing.machine_type ?? '—' },
                { label: 'Marka', value: listing.brand || '—' },
                { label: 'Model', value: listing.model || '—' },
                { label: 'Üretim Yılı', value: listing.year ?? '—' },
                { label: 'Kapasite', value: listing.capacity || '—' },
                { label: 'Durum', value: (conditionLabels as Record<string, string>)[listing.condition] ?? listing.condition ?? '—' },
                { label: 'Satış Nedeni', value: listing.sell_reason ? (sellReasonLabels[listing.sell_reason] ?? listing.sell_reason) : '—' },
                { label: 'Konum', value: (listing.location_city && listing.location_district) ? `${listing.location_city} / ${listing.location_district}` : (listing.location_city || listing.location_district || '—') },
                {
                  label: 'Başvuru Tarihi',
                  value: listing.created_at ? new Date(listing.created_at).toLocaleString('tr-TR') : '—',
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-[#94A3B8] mb-0.5">{label}</dt>
                  <dd className="text-gray-900 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            {/* Makineye özel teknik detaylar */}
            {listing.extra_fields && Object.keys(listing.extra_fields).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Teknik Detaylar</p>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(listing.extra_fields as Record<string, string>)
                    .filter(([, v]) => v)
                    .map(([k, v]) => {
                      const labels: Record<string, string> = {
                        tip: 'Tip', uzunluk: 'Uzunluk (mm)', tonaj: 'Tonaj',
                        kapasite_mm: 'Kapasite (mm)', ust_top_capi: 'Üst Top Çapı (mm)',
                        max_kalinlik: 'Maks. Kalınlık (mm)', calisma_sekli: 'Çalışma Şekli',
                        mil_capi: 'Mil Çapı (mm)', tipi: 'Boru Tipi', tipi_aciklama: 'Tip Açıklama',
                        mengene_acikligi: 'Mengene Açıklığı (mm)', makine_surucu: 'Makine Sürücüsü',
                        aci_ayari: 'Açı Ayarı', makine_turu: 'Makine Türü',
                        eksen_sayisi: 'Eksen Sayısı',
                      }
                      return (
                        <div key={k}>
                          <dt className="text-xs text-[#94A3B8] mb-0.5">{labels[k] ?? k}</dt>
                          <dd className="text-gray-900 font-medium">{v}</dd>
                        </div>
                      )
                    })}
                </dl>
              </div>
            )}
            </div>{/* /infoCardRef */}
          </div>

          {/* İletişim */}
          <div className="card">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">İletişim</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-[#94A3B8] mb-0.5">Ad Soyad</dt>
                <dd className="text-gray-900 font-medium">{listing.contact_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#94A3B8] mb-0.5">Cep Telefonu</dt>
                <dd>
                  <a href={`tel:${listing.contact_phone}`} className="text-[#3B5BDB] hover:underline font-medium">
                    {listing.contact_phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#94A3B8] mb-0.5">E-posta</dt>
                <dd>
                  <a href={`mailto:${listing.contact_email}`} className="text-[#3B5BDB] hover:underline font-medium">
                    {listing.contact_email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Müşteri Notu */}
          {listing.notes && (
            <div className="card">
              <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Müşteri Notu</h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{listing.notes}</p>
            </div>
          )}
        </div>

        {/* Sağ kolon: Durum + Teklif */}
        <div className="space-y-6">

          {/* Durum */}
          <div className="card">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Durum</h2>
            <div className="mb-4">
              <StatusBadge status={listing.status} />
              {listing.offer_price && (
                <p className="text-white font-bold text-2xl mt-2">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
                    .format(listing.offer_price)}
                </p>
              )}
              {listing.offer_sent_at && (
                <p className="text-[#94A3B8] text-xs mt-1">
                  Teklif: {new Date(listing.offer_sent_at).toLocaleString('tr-TR')}
                  {' '}({Math.floor((Date.now() - new Date(listing.offer_sent_at).getTime()) / 86400000)} gün önce)
                </p>
              )}
            </div>

            {listing.customer_response && (
              <div className="mt-4 p-3 rounded-lg bg-white border border-[#E2E8F0] space-y-2">
                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Müşteri Yanıtı</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  listing.customer_response === 'kabul' ? 'bg-green-100 text-green-800' :
                  listing.customer_response === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {listing.customer_response === 'kabul' ? '✅ Kabul Etti' :
                   listing.customer_response === 'red' ? '❌ Reddetti' : '💬 Karşı Teklif'}
                </span>
                {listing.counter_offer_price && (
                  <p className="text-white font-bold text-lg">
                    Karşı teklif: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(listing.counter_offer_price)}
                  </p>
                )}
                {listing.customer_note && (
                  <p className="text-[#475569] text-sm italic">"{listing.customer_note}"</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              {(['bekliyor', 'teklif-verildi', 'yanit-bekliyor', 'kabul', 'red', 'satildi'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={statusUpdating || listing.status === s}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left
                    ${listing.status === s
                      ? 'bg-[#3B5BDB] text-white cursor-default'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                    } disabled:opacity-50`}
                >
                  {statusLabels[s]}
                  {listing.status === s && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Teklif Gönder */}
          <div className="card">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Teklif Gönder</h2>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">Teklif Fiyatı (TL)</label>
                <input
                  type="number"
                  className="input-field text-lg font-bold"
                  placeholder="örn. 250000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">Not (isteğe bağlı)</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Müşteriye iletilecek ek not…"
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                />
              </div>
              {offerMsg && (
                <p className={`text-sm ${offerMsg.includes('başarı') ? 'text-green-400' : 'text-red-400'}`}>
                  {offerMsg}
                </p>
              )}
              <button
                onClick={sendOffer}
                disabled={offerSending}
                className="btn-primary w-full"
              >
                {offerSending ? 'Gönderiliyor…' : 'Mail & SMS ile Gönder'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
