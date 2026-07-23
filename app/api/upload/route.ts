import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
  const MAX_SIZE_BYTES = 15 * 1024 * 1024 // 15 MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Yalnızca resim dosyaları yüklenebilir (JPEG, PNG, WEBP)' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Dosya boyutu 15 MB sınırını aşıyor' }, { status: 400 })
  }

  const SAFE_EXT: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
    'image/gif': 'gif', 'image/heic': 'heic', 'image/heif': 'heif',
  }
  const ext = SAFE_EXT[file.type] ?? 'jpg'
  const path = `trink-makina/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from('listing-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.error('Supabase upload error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  const { data } = supabase.storage.from('listing-photos').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
