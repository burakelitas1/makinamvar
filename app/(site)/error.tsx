'use client'
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bir hata oluştu</h1>
        <p className="text-gray-500 mb-6">Sayfa yüklenirken bir sorun yaşandı.</p>
        <button onClick={reset} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}
