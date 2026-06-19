import { Resend } from 'resend'
import type { Listing } from './types'
import { machineTypeLabels, conditionLabels } from './types'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@example.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendAdminNotification(listing: Listing) {
  const resend = getResend()
  if (!resend || !ADMIN_EMAIL) return
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Yeni Makine Satış Talebi — ${machineTypeLabels[listing.machine_type]} (${listing.brand} ${listing.model})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Yeni Satış Talebi Geldi</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold">Makine Türü</td><td>${machineTypeLabels[listing.machine_type]}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Marka / Model</td><td>${listing.brand} ${listing.model}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Üretim Yılı</td><td>${listing.year}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Kapasite</td><td>${listing.capacity}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Durum</td><td>${conditionLabels[listing.condition]}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Konum</td><td>${listing.location_city} / ${listing.location_district}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">İletişim</td><td>${listing.contact_name} — ${listing.contact_phone} — ${listing.contact_email}</td></tr>
        </table>
        <p style="margin-top:20px">
          <a href="${APP_URL}/admin/${listing.id}"
             style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px">
            Admin Panelinde Görüntüle
          </a>
        </p>
      </div>
    `,
  })
}

export async function sendOfferToCustomer(listing: Listing, price: number, notes?: string, token?: string) {
  const resend = getResend()
  if (!resend) return

  const priceFormatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency: 'TRY', maximumFractionDigits: 0,
  }).format(price)

  const responseUrl = token ? `${APP_URL}/teklif/${token}` : null

  const responseSection = responseUrl ? `
    <div style="margin:24px 0;text-align:center">
      <p style="color:#333;margin-bottom:16px">Teklifimize hızlıca yanıt vermek için aşağıdaki butonu kullanabilirsiniz:</p>
      <a href="${responseUrl}"
         style="background:#f97316;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
        Teklifi Görüntüle ve Yanıtla
      </a>
      <p style="color:#999;font-size:12px;margin-top:12px">Bu teklif 3 gün geçerlidir.</p>
    </div>
  ` : `
    <p style="color:#666;font-size:14px;margin-top:16px">
      Teklifimizi kabul etmek veya daha fazla bilgi almak için
      <strong>${ADMIN_EMAIL}</strong> adresine mail gönderebilir ya da bizi arayabilirsiniz.
    </p>
  `

  await resend.emails.send({
    from: FROM,
    to: listing.contact_email,
    subject: `Makineniz İçin Teklif — ${listing.brand} ${listing.model}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <div style="background:#0a1628;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Değerli ${listing.contact_name},</h1>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #eee">
          <p style="color:#333">
            <strong>${listing.brand} ${listing.model}</strong> makineniz için incelememizi tamamladık.
            Size aşağıdaki teklifi sunmaktan memnuniyet duyarız:
          </p>
          <div style="background:white;border:2px solid #f97316;border-radius:8px;padding:24px;text-align:center;margin:20px 0">
            <p style="color:#666;margin:0 0 8px">Teklif Fiyatı</p>
            <p style="font-size:36px;font-weight:bold;color:#f97316;margin:0">${priceFormatted}</p>
          </div>
          ${notes ? `<p style="color:#555;background:#fff3e0;padding:12px;border-radius:6px;border-left:4px solid #f97316">${notes}</p>` : ''}
          ${responseSection}
        </div>
      </div>
    `,
  })
}

export async function sendAdminResponseNotification(listing: Listing, response: string, customerNote?: string, counterPrice?: number) {
  const resend = getResend()
  if (!resend || !ADMIN_EMAIL) return

  const responseLabels: Record<string, string> = {
    kabul: '✅ Kabul Etti',
    red: '❌ Reddetti',
    'karsi-teklif': '💬 Karşı Teklif Yaptı',
  }

  const priceFormatted = listing.offer_price
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(listing.offer_price)
    : '—'

  const counterFormatted = counterPrice
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(counterPrice)
    : null

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Müşteri Yanıtladı — ${responseLabels[response] ?? response} — ${listing.contact_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Müşteri Teklife Yanıt Verdi</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold">Müşteri</td><td>${listing.contact_name}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Makine</td><td>${listing.brand} ${listing.model}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Gönderilen Teklif</td><td>${priceFormatted}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Yanıt</td><td><strong>${responseLabels[response] ?? response}</strong></td></tr>
          ${counterFormatted ? `<tr><td style="padding:8px;font-weight:bold">Karşı Teklif</td><td><strong style="color:#f97316">${counterFormatted}</strong></td></tr>` : ''}
          ${customerNote ? `<tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Müşteri Notu</td><td>${customerNote}</td></tr>` : ''}
        </table>
        <p style="margin-top:20px">
          <a href="${APP_URL}/admin/${listing.id}"
             style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px">
            Admin Panelinde Görüntüle
          </a>
        </p>
      </div>
    `,
  })
}
