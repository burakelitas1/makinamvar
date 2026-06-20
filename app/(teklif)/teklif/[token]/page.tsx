import { createServiceClient } from '@/lib/supabase-server'
import TeklifClient from './TeklifClient'

export default async function TeklifPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('listings')
    .select('id, brand, model, offer_price, offer_token_expires_at, customer_response, status, contact_name')
    .eq('offer_token', token)
    .single()

  if (error || !data) {
    return <TeklifClient state="error" token={token} />
  }

  if (new Date(data.offer_token_expires_at) < new Date()) {
    return <TeklifClient state="expired" token={token} />
  }

  if (data.customer_response) {
    return <TeklifClient state="done" doneResponse={data.customer_response} token={token} />
  }

  return <TeklifClient state="view" data={data} token={token} />
}
