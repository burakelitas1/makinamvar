'use client'

import { useEffect, useState } from 'react'
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
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Talep bulunamadı.</p>
        <Link href="/admin" className="text-orange-400 hover:underline mt-4 inline-block">← Geri Dön</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
          ← Tüm Talepler
        </Link>
        <span className="text-navy-600">/</span>
        <span className="text-gray-300 text-sm">
          {listing.brand} {listing.model}
        </span>
      </div>

      {/* GEÇICI DEBUG - sonra silinecek */}
      <details className="mb-4 bg-navy-900 border border-navy-600 rounded-lg p-3">
        <summary className="text-xs text-gray-400 cursor-pointer">🔍 Debug: Ham veri</summary>
        <pre className="text-xs text-green-400 mt-2 overflow-auto max-h-64">{JSON.stringify(listing, null, 2)}</pre>
      </details>

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
                      <span className="text-gray-500">—</span>
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
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Fotoğraflar</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadPhoto(listing.photos[activePhoto], activePhoto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    ⬇ İndir
                  </button>
                  {listing.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => downloadAllPhotos(listing.photos)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      ⬇ Tümünü İndir ({listing.photos.length})
                    </button>
                  )}
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-navy-900 mb-3">
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
                        ${activePhoto === i ? 'border-orange-500' : 'border-navy-600'}`}
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
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Makine Bilgileri</h2>
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
                  <dt className="text-xs text-gray-500 mb-0.5">{label}</dt>
                  <dd className="text-white font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* İletişim */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">İletişim</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">Ad Soyad</dt>
                <dd className="text-white font-medium">{listing.contact_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">Cep Telefonu</dt>
                <dd>
                  <a href={`tel:${listing.contact_phone}`} className="text-orange-400 hover:underline font-medium">
                    {listing.contact_phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">E-posta</dt>
                <dd>
                  <a href={`mailto:${listing.contact_email}`} className="text-orange-400 hover:underline font-medium">
                    {listing.contact_email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sağ kolon: Durum + Teklif */}
        <div className="space-y-6">

          {/* Durum */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Durum</h2>
            <div className="mb-4">
              <StatusBadge status={listing.status} />
              {listing.offer_price && (
                <p className="text-white font-bold text-2xl mt-2">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
                    .format(listing.offer_price)}
                </p>
              )}
              {listing.offer_sent_at && (
                <p className="text-gray-500 text-xs mt-1">
                  Teklif: {new Date(listing.offer_sent_at).toLocaleString('tr-TR')}
                  {' '}({Math.floor((Date.now() - new Date(listing.offer_sent_at).getTime()) / 86400000)} gün önce)
                </p>
              )}
            </div>

            {listing.customer_response && (
              <div className="mt-4 p-3 rounded-lg bg-navy-800 border border-navy-600 space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Müşteri Yanıtı</p>
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
                  <p className="text-gray-300 text-sm italic">"{listing.customer_note}"</p>
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
                      ? 'bg-orange-500 text-white cursor-default'
                      : 'bg-navy-700 text-gray-300 hover:bg-navy-600 border border-navy-600'
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
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Teklif Gönder</h2>
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
