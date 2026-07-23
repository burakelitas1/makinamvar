import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

async function isAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && verifyAdminToken(token)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const body = await req.json()
  const { title, slug, content, cover_image, category, author_name, published } = body
  const supabase = createServiceClient()
  const { data: existing } = await supabase.from('posts').select('published, published_at').eq('id', params.id).single()
  const published_at = published && !existing?.published ? new Date().toISOString() : (existing?.published_at ?? null)
  const { data, error } = await supabase.from('posts').update({
    title, slug, content, cover_image: cover_image || null,
    category: category || null, author_name: author_name || null,
    published: !!published, published_at,
  }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const supabase = createServiceClient()
  const { error } = await supabase.from('posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
