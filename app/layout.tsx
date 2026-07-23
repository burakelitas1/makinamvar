import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const SITE_URL = 'https://trinkmakina.com'

export const viewport: Viewport = {
  themeColor: '#3B5BDB',
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
    images: [{ url: '/logo-horizontal.svg', width: 1200, height: 630, alt: 'Trink Makina — Sac İşleme Makinesi Alım Platformu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trink Makina — Makinenizi Sat, Nakit Al',
    description: 'Abkant pres, giyotin makas, lazer kesim makinenizi 48 saatte nakite çevirin.',
    images: ['/logo-horizontal.svg'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className={`${manrope.variable} min-h-screen bg-white font-sans`}>
        {children}
      </body>
    </html>
  )
}
