import type { ListingStatus } from '@/lib/types'
import { statusLabels } from '@/lib/types'

const colors: Record<ListingStatus, string> = {
  bekliyor:          'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'teklif-verildi':  'bg-blue-100 text-blue-800 border border-blue-200',
  'yanit-bekliyor':  'bg-purple-100 text-purple-800 border border-purple-200',
  kabul:             'bg-green-100 text-green-800 border border-green-200',
  red:               'bg-red-100 text-red-800 border border-red-200',
}

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
