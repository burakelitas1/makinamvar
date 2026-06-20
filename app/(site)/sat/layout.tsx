import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Makinenizi Satın — Ücretsiz Nakit Teklif Alın',
  description: 'Abkant pres, giyotin makas, lazer kesim, pres ve tüm sac işleme makineleriniz için 48 saat içinde nakit teklif alın. Söküm ve nakliye tamamen ücretsiz.',
  alternates: { canonical: 'https://trinkmakina.com/sat' },
  openGraph: {
    title: 'Makinenizi Satın | Trink Makina',
    description: 'Sac işleme makineniz için ücretsiz nakit teklif alın. 48 saat içinde değerlendirme, söküm ve nakliye bizden.',
    url: 'https://trinkmakina.com/sat',
  },
}

export default function SatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
