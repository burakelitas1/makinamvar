import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { sendOfferToCustomer } from '@/lib/email'
import { sendSms, buildOfferSmsText } from '@/lib/sms'
import type { Listing } from '@/lib/types'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { price, notes } = await req.json()

  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    return NextResponse.json({ error: 'Geçerli bir fiyat giriniz' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: listing, error: fetchErr } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (fetchErr || !listing) {
    return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })
  }

  const { error: updateErr } = await supabase
    .from('listings')
    .update({
      status: 'teklif-verildi',
      offer_price: Number(price),
      offer_sent_at: new Date().toISOString(),
      ...(notes ? { notes } : {}),
    })
    .eq('id', params.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  try {
    await sendOfferToCustomer(listing as Listing, Number(price), notes)
  } catch (e) {
    console.error('Teklif maili gönderilemedi:', e)
  }

  try {
    const smsText = buildOfferSmsText(listing.contact_name, Number(price))
    await sendSms(listing.contact_phone, smsText)
  } catch (e) {
    console.error('SMS gönderilemedi:', e)
  }

  return NextResponse.json({ ok: true })
}
