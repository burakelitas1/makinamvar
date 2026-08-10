import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

async function isAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && verifyAdminToken(token)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const body = await req.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('listings').update(body).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const supabase = createServiceClient()
  const { error } = await supabase.from('listings').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
