import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trink Makina — İkinci El Sac İşleme Makinesi Al-Sat',
  description: 'Abkant pres, giyotin makas, lazer kesim makinelerinizi en yüksek teklife satın. Söküm, nakliye ve ödeme güvencesi bizden.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-white">

        {/* Sticky Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <a href="/" className="flex items-center gap-1 flex-shrink-0">
              <span className="font-black text-xl text-[#2C3E50] tracking-tight">Trink</span>
              <span className="font-black text-xl bg-[#E67E22] text-white px-1.5 py-0.5 rounded tracking-tight">Makina</span>
            </a>

            {/* Tagline */}
            <p className="hidden lg:block text-sm text-gray-500 font-medium flex-1 ml-6">
              Makinenizi bugün satın, nakit ödemenizi hemen alın
            </p>

            {/* Butonlar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/sat"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-sm">
                Hemen Nakde Çevir
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-[#2C3E50] text-white mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-1 mb-3">
                  <span className="font-black text-xl tracking-tight">Trink</span>
                  <span className="font-black text-xl bg-[#E67E22] px-1.5 py-0.5 rounded tracking-tight">Makina</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Türkiye'nin İlk Sac İşleme Makineleri Alım Platformu
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Makine Türleri</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {['Abkant Pres', 'Giyotin Makas', 'Pres Makineleri', 'Silindir Makineleri', 'Boru Büküm Makineleri', 'Testereler'].map(m => (
                    <li key={m}><a href="/sat" className="hover:text-white transition-colors">{m}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Gizlilik Politikaları</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="/kvkk" className="hover:text-white transition-colors">Kişisel Verilerin Korunması</a></li>
                  <li><a href="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
                  <li><a href="/cerez-yonetimi" className="hover:text-white transition-colors">Çerez Yönetimi</a></li>
                  <li><a href="/ticari-ileti" className="hover:text-white transition-colors">Ticari İleti İzni</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">İletişim</h4>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span>📞</span>
                    <div>
                      <a href="tel:08501234567" className="hover:text-white transition-colors">0850 123 45 67</a>
                      <p className="text-gray-500 text-xs mt-0.5">Hafta içi 10:00 – 17:00</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✉️</span>
                    <a href="mailto:info@trinkmakina.com" className="hover:text-white transition-colors">info@trinkmakina.com</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📍</span>
                    <span>Örnek Mah. Sanayi Cad. No:1<br />Ataşehir / İstanbul</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-xs">
              <span>© 2026 Trink Makina — Bir Varmak Makine kuruluşudur.</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                <a href="/kvkk" className="hover:text-gray-300 transition-colors">Kişisel Verilerin Korunması</a>
                <a href="/kullanim-kosullari" className="hover:text-gray-300 transition-colors">Kullanım Koşulları</a>
                <a href="/cerez-yonetimi" className="hover:text-gray-300 transition-colors">Çerez Yönetimi</a>
                <a href="/ticari-ileti" className="hover:text-gray-300 transition-colors">Ticari İleti İzni</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
