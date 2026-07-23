import Image from 'next/image'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#3B5BDB] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        İçeriğe geç
      </a>
      <header className="bg-white/80 backdrop-blur-[20px] border-b border-[#E2E8F0] sticky top-0 z-50 h-[80px]">
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-6">
          <a href="/" className="flex items-center flex-shrink-0" aria-label="Trink Makina Ana Sayfa">
            <Image src="/logo-horizontal.svg" alt="Trink Makina" width={130} height={26} priority />
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#475569]">
            <a href="#nasil-calisir" className="hover:text-[#0F172A] transition-colors">Nasıl Çalışır</a>
            <a href="#sss" className="hover:text-[#0F172A] transition-colors">SSS</a>
            <a href="/blog" className="hover:text-[#0F172A] transition-colors">Blog</a>
          </nav>
          <a
            href="/sat"
            className="bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-6 h-[48px] rounded-[16px] text-[14px] transition-all duration-200 inline-flex items-center flex-shrink-0"
          >
            Ücretsiz Teklif Al
          </a>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-4">
                <Image src="/logo-horizontal.svg" alt="Trink Makina" width={120} height={24} />
              </div>
              <p className="text-[#475569] text-[14px] leading-[22px]">Endüstriyel Değerleme Platformu</p>
              <p className="text-[#94A3B8] text-[12px] mt-2 leading-[20px]">Sac işleme makinelerinizin gerçek piyasa değerini öğrenin.</p>
            </div>
            <nav aria-label="Makine türleri">
              <h4 className="font-semibold mb-4 text-[12px] text-[#94A3B8] uppercase tracking-wider">Makine Türleri</h4>
              <ul className="space-y-2.5 text-[#475569] text-[14px]">
                {['Abkant Pres', 'Giyotin Makas', 'Pres Makineleri', 'Silindir Makineleri', 'Boru Büküm', 'Testereler'].map(m => (
                  <li key={m}><a href="/sat" className="hover:text-[#0F172A] transition-colors">{m}</a></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Yasal">
              <h4 className="font-semibold mb-4 text-[12px] text-[#94A3B8] uppercase tracking-wider">Yasal</h4>
              <ul className="space-y-2.5 text-[#475569] text-[14px]">
                <li><a href="/kvkk" className="hover:text-[#0F172A] transition-colors">Kişisel Verilerin Korunması</a></li>
                <li><a href="/kullanim-kosullari" className="hover:text-[#0F172A] transition-colors">Kullanım Koşulları</a></li>
                <li><a href="/cerez-yonetimi" className="hover:text-[#0F172A] transition-colors">Çerez Yönetimi</a></li>
                <li><a href="/ticari-ileti" className="hover:text-[#0F172A] transition-colors">Ticari İleti İzni</a></li>
              </ul>
            </nav>
            <address className="not-italic">
              <h4 className="font-semibold mb-4 text-[12px] text-[#94A3B8] uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-3 text-[#475569] text-[14px]">
                <li>
                  <a href="tel:+908501234567" className="hover:text-[#0F172A] transition-colors">0850 123 45 67</a>
                  <p className="text-[#94A3B8] text-[12px] mt-0.5">Hafta içi 09:00 – 18:00</p>
                </li>
                <li><a href="mailto:info@trinkmakina.com" className="hover:text-[#0F172A] transition-colors">info@trinkmakina.com</a></li>
                <li className="text-[#94A3B8] text-[12px] leading-[20px]">Örnek Mah. Sanayi Cad. No:1<br />Ataşehir / İstanbul</li>
              </ul>
            </address>
          </div>
          <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#94A3B8] text-[12px]">
            <span>© {new Date().getFullYear()} Trink Makina — Bir Varmak Makine kuruluşudur.</span>
            <nav className="flex flex-wrap gap-x-6 gap-y-1 justify-center">
              <a href="/kvkk" className="hover:text-[#475569] transition-colors">KVKK</a>
              <a href="/kullanim-kosullari" className="hover:text-[#475569] transition-colors">Kullanım Koşulları</a>
              <a href="/cerez-yonetimi" className="hover:text-[#475569] transition-colors">Çerez Yönetimi</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
