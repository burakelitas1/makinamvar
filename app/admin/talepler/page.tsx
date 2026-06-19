import { createServiceClient } from '@/lib/supabase-server'
import type { Listing } from '@/lib/types'
import ExportButton from '@/components/ExportButton'
import TaleplerClient from './TaleplerClient'

export const revalidate = 0

export default async function TaleplerPage() {
  const supabase = createServiceClient()
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <div className="text-red-400">Veri yüklenemedi: {error.message}</div>

  const cities = [...new Set((listings as Listing[]).map((l) => l.location_city).filter((c): c is string => !!c))].sort()
  const brands = [...new Set((listings as Listing[]).map((l) => l.brand).filter((b): b is string => !!b))].sort()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Talepler</h1>
          <p className="text-gray-400 text-sm mt-1">Tüm makine satış başvuruları</p>
        </div>
        <ExportButton />
      </div>
      <TaleplerClient listings={listings as Listing[]} cities={cities} brands={brands} />
    </div>
  )
}
