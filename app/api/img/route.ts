import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_HOSTS = ['supabase.co', 'd8j0ntlcm91z4.cloudfront.net']

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  const allowed = ALLOWED_HOSTS.some((h) => parsed.hostname.endsWith(h))
  if (!allowed) return new NextResponse('Forbidden', { status: 403 })

  const response = await fetch(url, { headers: { 'User-Agent': 'TrinkMakina/1.0' } })
  if (!response.ok) return new NextResponse('Upstream error', { status: response.status })

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const arrayBuffer = await response.arrayBuffer()

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
