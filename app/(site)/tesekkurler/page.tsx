import Link from 'next/link'

export default function TesekkurlerPage() {
  return (
    <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2f4e] min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Başarı ikonu */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[#E67E22] rounded-full flex items-center justify-center shadow-2xl mb-6">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 text-center">Talebiniz Alındı!</h1>
          <p className="text-blue-300 text-center text-sm max-w-sm">
            Uzmanlarımız makinenizi inceleyip en kısa sürede sizinle iletişime geçecek.
          </p>
        </div>

        {/* Kart */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-12 h-12 bg-[#E67E22] rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                📱
              </div>
              <div>
                <p className="font-bold text-gray-900">SMS Bildirimi</p>
                <p className="text-gray-500 text-sm">Teklifimiz 24 saat içinde cep telefonunuza SMS ile iletilecektir.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-[#2C3E50] rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                ✉️
              </div>
              <div>
                <p className="font-bold text-gray-900">E-posta Bildirimi</p>
                <p className="text-gray-500 text-sm">Detaylı teklif mektubumuz e-posta adresinize gönderilecektir.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                ⚡
              </div>
              <div>
                <p className="font-bold text-gray-900">24 Saat İçinde</p>
                <p className="text-gray-500 text-sm">Teknik ekibimiz makinenizi inceleyerek en iyi fiyatı belirleyecektir.</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 text-center py-3.5 rounded-xl bg-[#E67E22] hover:bg-[#D35400] text-white font-bold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/sat"
              className="flex-1 text-center py-3.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold transition-colors text-sm"
            >
              Yeni Makine Ekle
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
