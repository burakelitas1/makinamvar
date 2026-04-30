import { NextResponse } from 'next/server'
import { createAdminToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 })
  }

  const token = await createAdminToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
  return res
}
