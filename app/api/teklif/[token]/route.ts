import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { sendAdminResponseNotification } from '@/lib/email'
import type { Listing, CustomerResponse } from '@/lib/types'

const VALID_RESPONSES: CustomerResponse[] = ['kabul', 'red', 'karsi-teklif']

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('listings')
    .select('id, brand, model, offer_price, offer_token_expires_at, customer_response, status, contact_name')
    .eq('offer_token', params.token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş link' }, { status: 404 })
  }

  if (new Date(data.offer_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Bu linkin süresi dolmuş' }, { status: 410 })
  }

  return NextResponse.json(data)
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { response, note, counter_price } = await req.json()

  if (!VALID_RESPONSES.includes(response)) {
    return NextResponse.json({ error: 'Geçersiz yanıt' }, { status: 400 })
  }

  if (response === 'karsi-teklif' && (!counter_price || isNaN(Number(counter_price)) || Number(counter_price) <= 0)) {
    return NextResponse.json({ error: 'Karşı teklif için geçerli bir fiyat giriniz' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: listing, error: fetchErr } = await supabase
    .from('listings')
    .select('*')
    .eq('offer_token', params.token)
    .single()

  if (fetchErr || !listing) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş link' }, { status: 404 })
  }

  if (new Date(listing.offer_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Bu linkin süresi dolmuş' }, { status: 410 })
  }

  if (listing.customer_response) {
    return NextResponse.json({ error: 'Bu teklife zaten yanıt verildi' }, { status: 409 })
  }

  const newStatus = response === 'kabul' ? 'kabul' : response === 'red' ? 'red' : 'yanit-bekliyor'

  const { error: updateErr } = await supabase
    .from('listings')
    .update({
      customer_response: response,
      customer_note: note || null,
      counter_offer_price: response === 'karsi-teklif' ? Number(counter_price) : null,
      status: newStatus,
    })
    .eq('id', listing.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  try {
    await sendAdminResponseNotification(
      listing as Listing,
      response,
      note,
      response === 'karsi-teklif' ? Number(counter_price) : undefined
    )
  } catch (e) {
    console.error('Admin bildirim maili gönderilemedi:', e)
  }

  return NextResponse.json({ ok: true, status: newStatus })
}
