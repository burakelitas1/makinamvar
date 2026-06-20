'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

type OfferData = {
  id: string
  brand: string
  model: string
  offer_price: number
  contact_name: string
  customer_response: string | null
}

type Step = 'loading' | 'expired' | 'error' | 'view' | 'counter' | 'done'

export default function TeklifPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<OfferData | null>(null)
  const [step, setStep] = useState<Step>('loading')
  const [counterPrice, setCounterPrice] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [doneResponse, setDoneResponse] = useState<string>('')

  useEffect(() => {
    fetch(`/api/teklif/${token}`)
      .then(async (res) => {
        if (res.status === 410) { setStep('expired'); return }
        if (!res.ok) { setStep('error'); return }
        const d = await res.json()
        if (d.customer_response) {
          setDoneResponse(d.customer_response)
          setStep('done')
        } else {
          setData(d)
          setStep('view')
        }
      })
      .catch(() => setStep('error'))
  }, [token])

  async function respond(response: 'kabul' | 'red' | 'karsi-teklif') {
    if (response === 'karsi-teklif' && (!counterPrice || isNaN(Number(counterPrice)) || Number(counterPrice) <= 0)) return
    setSubmitting(true)
    const res = await fetch(`/api/teklif/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response,
        note: note || undefined,
        counter_price: response === 'karsi-teklif' ? Number(counterPrice) : undefined,
      }),
    })
    setSubmitting(false)
    if (res.ok) {
      setDoneResponse(response)
      setStep('done')
    }
  }

  const priceFormatted = data?.offer_price
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(data.offer_price)
    : ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" aria-label="Trink Makina Ana Sayfa">
            <Image src="/logo-horizontal.svg" alt="Trink Makina" width={160} height={32} className="mx-auto" />
          </a>
        </div>

        {step === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#E67E22] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {step === 'expired' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Bu linkin süresi dolmuş</h1>
            <p className="text-gray-500 text-sm">Teklif linki 30 gün geçerlidir. Yeni teklif için bizimle iletişime geçin.</p>
          </div>
        )}

        {step === 'error' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Geçersiz link</h1>
            <p className="text-gray-500 text-sm">Bu teklif linki bulunamadı. Lütfen emailinizi kontrol edin.</p>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            {doneResponse === 'kabul' && (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Teklifi kabul ettiniz</h1>
                <p className="text-gray-500 text-sm">Ekibimiz en kısa sürede sizinle iletişime geçecek. Teşekkür ederiz!</p>
              </>
            )}
            {doneResponse === 'red' && (
              <>
                <div className="text-5xl mb-4">👋</div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Yanıtınız alındı</h1>
                <p className="text-gray-500 text-sm">Teklifi reddettiğiniz bilgisi iletildi. İleride tekrar başvurabilirsiniz.</p>
              </>
            )}
            {doneResponse === 'karsi-teklif' && (
              <>
                <div className="text-5xl mb-4">💬</div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Karşı teklifiniz alındı</h1>
                <p className="text-gray-500 text-sm">Ekibimiz değerlendirip sizinle iletişime geçecek. Teşekkür ederiz!</p>
              </>
            )}
          </div>
        )}

        {step === 'view' && data && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#2C3E50] px-8 py-6">
              <p className="text-gray-300 text-sm">Değerli {data.contact_name},</p>
              <h1 className="text-white text-xl font-bold mt-1">{data.brand} {data.model} makineniz için teklif hazır</h1>
            </div>
            <div className="px-8 py-6">
              <div className="border-2 border-[#E67E22] rounded-xl p-6 text-center mb-6">
                <p className="text-gray-500 text-sm mb-1">Teklif Fiyatı</p>
                <p className="text-4xl font-black text-[#E67E22]">{priceFormatted}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => respond('kabul')}
                  disabled={submitting}
                  className="w-full bg-[#27AE60] hover:bg-[#219a52] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  ✅ Kabul Ediyorum
                </button>

                <button
                  onClick={() => setStep('counter')}
                  disabled={submitting}
                  className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  💬 Karşı Teklif / Not Bırak
                </button>

                <button
                  onClick={() => respond('red')}
                  disabled={submitting}
                  className="w-full border border-gray-300 hover:border-gray-400 text-gray-600 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  ❌ Kabul Etmiyorum
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'counter' && data && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#2C3E50] px-8 py-6">
              <h1 className="text-white text-xl font-bold">Karşı Teklif / Not</h1>
              <p className="text-gray-300 text-sm mt-1">Teklif fiyatı: {priceFormatted}</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Karşı teklif fiyatı (TL)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#E67E22] focus:ring-1 focus:ring-[#E67E22]"
                  placeholder="örn. 280000"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Not (isteğe bağlı)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#E67E22] focus:ring-1 focus:ring-[#E67E22]"
                  rows={3}
                  placeholder="Eklemek istediğiniz bir şey varsa buraya yazın…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <button
                onClick={() => respond('karsi-teklif')}
                disabled={submitting || !counterPrice}
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'Gönderiliyor…' : 'Karşı Teklifi Gönder'}
              </button>
              <button
                onClick={() => setStep('view')}
                disabled={submitting}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
              >
                ← Geri Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
