import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

const VALID_STATUSES = ['bekliyor', 'teklif-verildi', 'yanit-bekliyor', 'kabul', 'red', 'satildi']

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

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
