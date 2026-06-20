import Image from 'next/image'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Trink Makina Ana Sayfa">
            <Image src="/logo-horizontal.svg" alt="Trink Makina" width={180} height={36} priority />
          </a>
          <p className="hidden lg:block text-sm text-gray-500 font-medium flex-1 ml-6">
            Makinenizi bugün satın, nakit ödemenizi hemen alın
          </p>
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
              <div className="mb-3">
                <Image src="/logo-horizontal.svg" alt="Trink Makina" width={150} height={30} style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Türkiye&apos;nin İlk Sac İşleme Makineleri Alım Platformu
              </p>
            </div>
            <nav aria-label="Makine türleri">
              <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Makine Türleri</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                {['Abkant Pres', 'Giyotin Makas', 'Pres Makineleri', 'Silindir Makineleri', 'Boru Büküm Makineleri', 'Testereler'].map(m => (
                  <li key={m}><a href="/sat" className="hover:text-white transition-colors">{m}</a></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Gizlilik politikaları">
              <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Gizlilik Politikaları</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="/kvkk" className="hover:text-white transition-colors">Kişisel Verilerin Korunması</a></li>
                <li><a href="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
                <li><a href="/cerez-yonetimi" className="hover:text-white transition-colors">Çerez Yönetimi</a></li>
                <li><a href="/ticari-ileti" className="hover:text-white transition-colors">Ticari İleti İzni</a></li>
              </ul>
            </nav>
            <address className="not-italic">
              <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">📞</span>
                  <div>
                    <a href="tel:+908501234567" className="hover:text-white transition-colors">0850 123 45 67</a>
                    <p className="text-gray-500 text-xs mt-0.5">Hafta içi 10:00 – 17:00</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">✉️</span>
                  <a href="mailto:info@trinkmakina.com" className="hover:text-white transition-colors">info@trinkmakina.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">📍</span>
                  <span>Örnek Mah. Sanayi Cad. No:1<br />Ataşehir / İstanbul</span>
                </li>
              </ul>
            </address>
          </div>
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-xs">
            <span>© {new Date().getFullYear()} Trink Makina — Bir Varmak Makine kuruluşudur.</span>
            <nav aria-label="Alt bağlantılar" className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <a href="/kvkk" className="hover:text-gray-300 transition-colors">Kişisel Verilerin Korunması</a>
              <a href="/kullanim-kosullari" className="hover:text-gray-300 transition-colors">Kullanım Koşulları</a>
              <a href="/cerez-yonetimi" className="hover:text-gray-300 transition-colors">Çerez Yönetimi</a>
              <a href="/ticari-ileti" className="hover:text-gray-300 transition-colors">Ticari İleti İzni</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
