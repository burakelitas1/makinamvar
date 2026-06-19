import { createServiceClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const settings: Record<string, string> = {}
  data?.forEach((row) => { settings[row.key] = row.value })
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const supabase = createServiceClient()
  const body: Record<string, string> = await req.json()
  const upserts = Object.entries(body).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
