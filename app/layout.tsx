import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import './globals.css'

const SITE_URL = 'https://trinkmakina.com'

export const viewport: Viewport = {
  themeColor: '#E67E22',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Trink Makina — İkinci El Sac İşleme Makinesi Sat, Nakit Al',
    template: '%s | Trink Makina',
  },
  description: 'Abkant pres, giyotin makas, lazer kesim makinenizi satın — 48 saat içinde nakit teklif alın. Söküm, vinç ve nakliye tamamen ücretsiz. Türkiye geneli hizmet.',
  keywords: [
    'ikinci el sac işleme makinesi sat',
    'abkant pres sat',
    'giyotin makas sat',
    'lazer kesim makinesi sat',
    'makine satın al',
    'trink makina',
    'sac makine alım',
    'nakit makine teklif',
    'ikinci el endüstriyel makine',
  ],
  authors: [{ name: 'Trink Makina', url: SITE_URL }],
  creator: 'Trink Makina',
  publisher: 'Trink Makina',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'tr-TR': SITE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE_URL,
    siteName: 'Trink Makina',
    title: 'Trink Makina — İkinci El Sac İşleme Makinesi Sat, Nakit Al',
    description: 'Abkant pres, giyotin makas, lazer kesim makinenizi 48 saat içinde nakite çevirin. Söküm ve nakliye bizden.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Trink Makina — Sac İşleme Makinesi Alım Platformu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trink Makina — Makinenizi Sat, Nakit Al',
    description: 'Abkant pres, giyotin makas, lazer kesim makinenizi 48 saatte nakite çevirin.',
    images: ['/og-image.png'],
  },
  verification: {
    google: '',
  },
  category: 'business',
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: 'Trink Makina',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-horizontal.svg`,
        width: 180,
        height: 36,
      },
      image: `${SITE_URL}/logo-horizontal.svg`,
      description: 'Türkiye genelinde ikinci el sac işleme makinesi alan platform. Abkant pres, giyotin makas, lazer kesim ve daha fazlası için nakit teklif.',
      telephone: '+908501234567',
      email: 'info@trinkmakina.com',
      priceRange: 'Ücretsiz Değerlendirme',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Örnek Mah. Sanayi Cad. No:1',
        addressLocality: 'Ataşehir',
        addressRegion: 'İstanbul',
        postalCode: '34758',
        addressCountry: 'TR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.9923,
        longitude: 29.1244,
      },
      areaServed: { '@type': 'Country', name: 'Turkey' },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '17:00',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '850',
        bestRating: '5',
        worstRating: '1',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Trink Makina',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/sat?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/hero-factory.svg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className="min-h-screen bg-white">

        {/* Sticky Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <a href="/" className="flex items-center flex-shrink-0" aria-label="Trink Makina Ana Sayfa">
              <Image src="/logo-horizontal.svg" alt="Trink Makina" width={180} height={36} priority />
            </a>

            {/* Tagline */}
            <p className="hidden lg:block text-sm text-gray-500 font-medium flex-1 ml-6">
              Makinenizi bugün satın, nakit ödemenizi hemen alın
            </p>

            {/* CTA */}
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
      </body>
    </html>
  )
}
