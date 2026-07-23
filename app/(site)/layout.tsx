import Image from 'next/image'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Trink Makina Ana Sayfa">
            <Image src="/logo-horizontal.svg" alt="Trink Makina" width={130} height={26} priority />
          </a>
          <p className="hidden lg:block text-sm text-[#475569] font-medium flex-1 ml-8">
            Makinenizin piyasa değerini ücretsiz öğrenin
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href="#nasil-calisir" className="hidden sm:block text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors">
              Nasıl çalışır?
            </a>
            <a href="/sat" className="bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Ücretsiz Teklif Al
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-[#0F172A] text-white mt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-3">
                <Image src="/logo-horizontal.svg" alt="Trink Makina" width={130} height={26} style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">Endüstriyel Değerleme Platformu</p>
              <p className="text-[#64748B] text-xs mt-2 leading-relaxed">Sac işleme makinelerinizin gerçek piyasa değerini öğrenin.</p>
            </div>
            <nav aria-label="Makine türleri">
              <h4 className="font-semibold mb-4 text-xs text-[#64748B] uppercase tracking-wider">Makine Türleri</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                {['Abkant Pres', 'Giyotin Makas', 'Pres Makineleri', 'Silindir Makineleri', 'Boru Büküm Makineleri', 'Testereler'].map(m => (
                  <li key={m}><a href="/sat" className="hover:text-white transition-colors">{m}</a></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Yasal">
              <h4 className="font-semibold mb-4 text-xs text-[#64748B] uppercase tracking-wider">Yasal</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li><a href="/kvkk" className="hover:text-white transition-colors">Kişisel Verilerin Korunması</a></li>
                <li><a href="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
                <li><a href="/cerez-yonetimi" className="hover:text-white transition-colors">Çerez Yönetimi</a></li>
                <li><a href="/ticari-ileti" className="hover:text-white transition-colors">Ticari İleti İzni</a></li>
              </ul>
            </nav>
            <address className="not-italic">
              <h4 className="font-semibold mb-4 text-xs text-[#64748B] uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-3 text-[#94A3B8] text-sm">
                <li>
                  <a href="tel:+908501234567" className="hover:text-white transition-colors">0850 123 45 67</a>
                  <p className="text-[#64748B] text-xs mt-0.5">Hafta içi 09:00 – 18:00</p>
                </li>
                <li><a href="mailto:info@trinkmakina.com" className="hover:text-white transition-colors">info@trinkmakina.com</a></li>
                <li className="text-[#64748B] text-xs leading-relaxed">Örnek Mah. Sanayi Cad. No:1<br />Ataşehir / İstanbul</li>
              </ul>
            </address>
          </div>
          <div className="border-t border-[#1E293B] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#64748B] text-xs">
            <span>© {new Date().getFullYear()} Trink Makina — Bir Varmak Makine kuruluşudur.</span>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <a href="/kvkk" className="hover:text-[#94A3B8] transition-colors">KVKK</a>
              <a href="/kullanim-kosullari" className="hover:text-[#94A3B8] transition-colors">Kullanım Koşulları</a>
              <a href="/cerez-yonetimi" className="hover:text-[#94A3B8] transition-colors">Çerez Yönetimi</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
