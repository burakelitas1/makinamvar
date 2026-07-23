import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  if (!parsed.hostname.endsWith('supabase.co')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Extract bucket and path from Supabase storage URL
  // Format: /storage/v1/object/public/<bucket>/<path>
  const match = parsed.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/)
  if (!match) return new NextResponse('Invalid storage url', { status: 400 })

  const [, bucket, path] = match
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage.from(bucket).download(path)

  if (error || !data) {
    return new NextResponse('Not found', { status: 404 })
  }

  const arrayBuffer = await data.arrayBuffer()
  const contentType = data.type || 'image/jpeg'

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
