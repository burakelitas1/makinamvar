import Link from 'next/link'

export default function TesekkurlerPage() {
  return (
    <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Başarı kartı */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">

          {/* Üst bant */}
          <div className="bg-gradient-to-r from-brand-blueDark to-brand-blue p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Talebiniz Alındı!</h1>
            <p className="text-blue-200 text-sm">Uzmanlarımız en kısa sürede sizinle iletişime geçecek.</p>
          </div>

          {/* İçerik */}
          <div className="p-6 space-y-4">

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">SMS Bildirimi</p>
                <p className="text-gray-500 text-sm">Teklifimiz 24 saat içinde kayıtlı cep telefonunuza SMS ile iletilecektir.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">✉️</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">E-posta Bildirimi</p>
                <p className="text-gray-500 text-sm">Detaylı teklif mektubumuz e-posta adresinize gönderilecektir. Spam klasörünü kontrol edin.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⏱️</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">24 Saat İçinde</p>
                <p className="text-gray-500 text-sm">Teknik ekibimiz makinenizi inceleyerek en iyi fiyatı belirleyecektir.</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn-blue flex-1 text-center py-3">
              Ana Sayfaya Dön
            </Link>
            <Link href="/sat" className="btn-outline flex-1 text-center py-3 text-sm">
              Yeni Makine Ekle
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
