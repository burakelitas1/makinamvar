import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const VALID_STATUSES = ['bekliyor', 'teklif-verildi', 'yanit-bekliyor', 'kabul', 'red', 'satildi']

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
