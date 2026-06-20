import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { sendAdminNotification } from '@/lib/email'
import type { Listing } from '@/lib/types'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const required = [
      'machine_type', 'brand', 'year',
      'condition', 'location_city', 'location_district',
      'contact_name', 'contact_phone', 'contact_email',
    ]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} zorunludur` }, { status: 400 })
      }
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('listings')
      .insert({
        machine_type: body.machine_type,
        brand: body.brand,
        model: body.model,
        year: Number(body.year),
        capacity: body.capacity,
        condition: body.condition,
        sell_reason: body.sell_reason ?? null,
        location_city: body.location_city,
        location_district: body.location_district,
        contact_name: body.contact_name,
        contact_phone: body.contact_phone,
        contact_email: body.contact_email,
        photos: body.photos ?? [],
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 })
    }

    try {
      await sendAdminNotification(data as Listing)
    } catch (emailErr) {
      console.error('Admin bildirimi gönderilemedi:', emailErr)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }
}
