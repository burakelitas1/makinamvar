import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

async function isAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && verifyAdminToken(token)
}

export async function GET() {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const body = await req.json()
  const { title, slug, content, cover_image, category, author_name, published } = body
  if (!title || !slug || !content) return NextResponse.json({ error: 'Başlık, slug ve içerik zorunludur.' }, { status: 400 })
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('posts').insert([{
    title, slug, content, cover_image: cover_image || null,
    category: category || null, author_name: author_name || null,
    published: !!published,
    published_at: published ? new Date().toISOString() : null,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
