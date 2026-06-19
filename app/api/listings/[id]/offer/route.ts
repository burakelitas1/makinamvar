import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { sendOfferToCustomer } from '@/lib/email'
import { sendSms, buildOfferSmsText } from '@/lib/sms'
import type { Listing } from '@/lib/types'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { price, notes } = await req.json()

  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    return NextResponse.json({ error: 'Geçerli bir fiyat giriniz' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: listing, error: fetchErr } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !listing) {
    return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 })
  }

  const token = generateToken()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { error: updateErr } = await supabase
    .from('listings')
    .update({
      status: 'teklif-verildi',
      offer_price: Number(price),
      offer_sent_at: new Date().toISOString(),
      offer_token: token,
      offer_token_expires_at: expiresAt,
      customer_response: null,
      customer_note: null,
      counter_offer_price: null,
      ...(notes ? { notes } : {}),
    })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  try {
    await sendOfferToCustomer(listing as Listing, Number(price), notes, token)
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
