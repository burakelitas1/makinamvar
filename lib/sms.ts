export async function sendSms(phone: string, message: string): Promise<boolean> {
  const apiKey = process.env.SMS_API_KEY
  if (!apiKey) return false

  try {
    const params = new URLSearchParams({
      usercode: apiKey,
      apikey: apiKey,
      gsmno: phone.replace(/\D/g, ''),
      message,
      msgheader: process.env.SMS_ORIGINATOR ?? 'MAKINESAT',
    })

    const url = process.env.SMS_API_URL ?? 'https://api.netgsm.com.tr/sms/send/get'
    const res = await fetch(`${url}?${params}`)
    return res.ok
  } catch {
    return false
  }
}

export function buildOfferSmsText(contactName: string, price: number): string {
  const priceFormatted = new Intl.NumberFormat('tr-TR').format(price)
  return `Sayin ${contactName}, makineniz icin ${priceFormatted} TL teklif verildi. Detaylar mail adresinize gonderildi. Bilgi: ${process.env.ADMIN_EMAIL}`
}
