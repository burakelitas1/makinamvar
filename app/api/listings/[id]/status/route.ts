import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const VALID_STATUSES = ['bekliyor', 'teklif-verildi', 'yanit-bekliyor', 'kabul', 'red']

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
