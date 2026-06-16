import Link from 'next/link'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FaqSection from '@/components/FaqSection'
import { createServiceClient } from '@/lib/supabase-server'

export const revalidate = 0

const ADVANTAGES = [
  {
    title: 'Doğru Fiyat ve Şeffaf Değerlendirme',
    desc: 'Makinenizin gerçek değerini belirliyoruz. Sürpriz kesinti yok, tam şeffaflık.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="#E67E22" strokeWidth="2.5" fill="#FFF3E0"/>
        <path d="M14 24h20M14 30h12" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="34" cy="17" r="5" fill="#27AE60" stroke="#1E8449" strokeWidth="1.5"/>
        <path d="M32 17l1.5 1.5L36 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Söküm, Vinç & Nakliye Bizden',
    desc: 'Makinenizin söküm, vinç ve nakliye işlemleri tamamen tarafımızca karşılanır.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="2" y="28" width="44" height="12" rx="3" fill="#E8F5E9" stroke="#27AE60" strokeWidth="2"/>
        <rect x="6" y="18" width="24" height="12" rx="2" fill="#C8E6C9" stroke="#27AE60" strokeWidth="2"/>
        <circle cx="12" cy="40" r="4" fill="#27AE60" stroke="#1E8449" strokeWidth="1.5"/>
        <circle cx="36" cy="40" r="4" fill="#27AE60" stroke="#1E8449" strokeWidth="1.5"/>
        <path d="M30 18v-6M30 12h8l4 6" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: '24 Saatte Nakit Teklif',
    desc: 'Formunuzu gönderin, 24 saat içinde SMS ve mail ile nakit teklifiniz gelsin.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" fill="#FFF3E0" stroke="#E67E22" strokeWidth="2.5"/>
        <path d="M24 14v10l6 4" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 8l4 4M38 8l-4 4" stroke="#E67E22" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Ücretsiz Online Ekspertiz',
    desc: 'Uzman teknik ekibimiz makinenizi online olarak ücretsiz değerlendirir.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="32" height="24" rx="3" fill="#E3F2FD" stroke="#2C3E50" strokeWidth="2"/>
        <rect x="18" y="32" width="12" height="4" fill="#2C3E50" rx="1"/>
        <path d="M14 40h20" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="5" fill="white" stroke="#E67E22" strokeWidth="2"/>
        <path d="M22 20l1.5 1.5L26 18" stroke="#E67E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Peşin & Güvenceli Ödeme',
    desc: 'Satış anında ödemeniz yapılır. Bekleme yok, taahhütsüz, güvenli.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="14" width="36" height="24" rx="4" fill="#E8F5E9" stroke="#27AE60" strokeWidth="2.5"/>
        <rect x="6" y="20" width="36" height="6" fill="#C8E6C9"/>
        <circle cx="34" cy="32" r="3" fill="#27AE60"/>
        <circle cx="26" cy="32" r="3" fill="#A5D6A7"/>
      </svg>
    ),
  },
]

const STEPS = [
  {
    icon: '📋',
    title: 'Teklif Alın',
    desc: 'Makine bilgilerini ve fotoğraflarını girin. 2 dakikada formu tamamlayın.',
  },
  {
    icon: '📞',
    title: 'Uzmanımız Sizi Arasın',
    desc: '24 saat içinde teknik ekibimiz sizi arayarak makineyi değerlendirsin.',
  },
  {
    icon: '✅',
    title: 'Anlaşın, Nakit Alın',
    desc: 'Teklifi onaylayın. Söküm, nakliye bizden — ödemeniz aynı gün yapılır.',
  },
]

const COMPARE_ROWS = [
  { label: 'Alıcı Bulma Süresi',  onur: 'Haftalar / Aylar',       us: '24 Saat' },
  { label: 'Lojistik',            onur: 'Satıcıya ait',           us: 'Bizim üstümüzde' },
  { label: 'Ödeme Güvencesi',     onur: 'Belirsiz',               us: 'Peşin & Güvenceli' },
  { label: 'Söküm / Nakliye',     onur: 'Satıcıya ait',           us: 'Ücretsiz karşılanır' },
  { label: 'Pazarlık Stresi',     onur: 'Yüksek',                 us: 'Yok — biz hallederiz' },
]

const DEFAULT_FAQS = [
  { question: 'Makinam Var nedir?', answer: 'Makinam Var, ikinci el sac işleme makinesi satmak isteyen kişilerin makinelerini platforma kayıtlı alıcılara online olarak sunduğu, söküm ve nakliye dahil tam hizmet veren bir alım platformudur.' },
  { question: 'Hangi makineler için teklif alabilirsiniz?', answer: 'Abkant pres, giyotin makas, lazer kesim, punta kaynak ve tüm sac işleme makineleri için teklif alabilirsiniz. Çalışır veya arızalı tüm makineleri değerlendiriyoruz.' },
  { question: 'Söküm ve nakliye gerçekten ücretsiz mi?', answer: 'Evet. Anlaşma sağlandığında makinenizin söküm, vinç ve nakliye işlemlerini tamamen biz karşılıyoruz. Sizin herhangi bir masraf yapmanız gerekmez.' },
  { question: 'Teklif alma süreci nasıl işliyor?', answer: 'Formu doldurduğunuzda uzman ekibimiz makinenizi inceler. 24 saat içinde SMS ve e-posta ile nakit teklifini iletir. Kabul edip etmemek tamamen size kalmış.' },
  { question: 'Bu hizmet ücretli mi?', answer: 'Hayır, teklif alma ve tüm süreç tamamen ücretsizdir. Satış gerçekleşmeden herhangi bir ücret alınmaz.' },
  { question: 'Ödeme ne zaman yapılır?', answer: 'Satışı onayladıktan, evrak işlemleri tamamlandıktan ve ürünler nakliye aracına yüklendikten sonra ödeme aynı gün hesabınıza yapılır.' },
]

export default async function HomePage() {
  const supabase = createServiceClient()

  const [{ data: dbTestimonials }, { data: dbFaqs }, { data: dbSettings }] = await Promise.all([
    supabase.from('testimonials').select('name,detail,text,date').eq('active', true).order('order_num'),
    supabase.from('faqs').select('question,answer').eq('active', true).order('order_num'),
    supabase.from('site_settings').select('key,value'),
  ])

  const settings: Record<string, string> = {}
  dbSettings?.forEach((r) => { settings[r.key] = r.value })

  const testimonials = dbTestimonials ?? []
  const faqs = (dbFaqs && dbFaqs.length > 0) ? dbFaqs : DEFAULT_FAQS

  const heroBadge = settings['hero_badge'] || 'Türkiye\'nin İlk Sac İşleme Makineleri Alım Platformu'
  const heroTitle = settings['hero_title'] || 'Makinenizi bugün satın, nakit ödemenizi hemen alın'
  const ctaTitle = settings['cta_banner_title'] || 'Makineniz atıl mı duruyor?'
  const ctaSubtitle = settings['cta_banner_subtitle'] || 'Hemen formu doldurun, 24 saat içinde nakit teklifiniz gelsin.'

  return (
    <div className="bg-white">

      {/* ══ HERO — Endüstriyel Arka Plan + Overlay ══ */}
      <section className="relative min-h-[500px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://d8j0ntlcm91z4.cloudfront.net/user_35eUMy38SQL2PT06afk6uyN041G/hf_20260616_145758_be0e9a6a-fcb9-470d-a31b-7234fdd3e64c.png')", filter: 'blur(2px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10, 25, 70, 0.88)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-[#E67E22]/20 border border-[#E67E22]/50 rounded-full px-4 py-1.5 text-[#F39C12] text-sm font-semibold mb-5">
                <span className="w-2 h-2 bg-[#E67E22] rounded-full animate-pulse" />
                {heroBadge}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                {heroTitle.includes('nakit') ? (
                  <>
                    {heroTitle.split('nakit')[0]}
                    <span className="text-[#E67E22]">nakit</span>
                    {heroTitle.split('nakit')[1]}
                  </>
                ) : heroTitle}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-3">
                Sac işleme makinenizi yüzlerce alıcıya sunuyoruz. Söküm, vinç ve nakliye işlemleri bizden.
              </p>

              <div className="flex items-center gap-2 bg-[#27AE60]/20 border border-[#27AE60]/40 rounded-lg px-4 py-2.5 mb-7 w-fit">
                <span className="text-[#27AE60] text-xl">🚛</span>
                <span className="text-[#2ECC71] font-semibold text-sm">
                  Söküm, Vinç ve Nakliye Tamamen Ücretsiz
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sat" className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg text-center">
                  Hemen Nakde Çevir →
                </Link>
                <a href="#nasil-calisir" className="border-2 border-white/40 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl text-lg transition-colors text-center">
                  Nasıl Çalışır?
                </a>
              </div>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-300">
                <span>✅ Ücretsiz</span>
                <span>✅ Taahhütsüz</span>
                <span>✅ 24 Saatte Nakit Teklif</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7">
              <p className="text-white font-bold text-lg mb-5">Neden Makinam Var?</p>
              <div className="space-y-3">
                {[
                  { icon: '⚡', text: '24 saat içinde nakit teklif' },
                  { icon: '🚛', text: 'Söküm, vinç ve nakliye bizden' },
                  { icon: '💰', text: 'Aynı gün peşin ödeme' },
                  { icon: '🔍', text: 'Ücretsiz online teknik ekspertiz' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20 text-center">
                {[{ v: '2.400+', l: 'İlan' }, { v: '850+', l: 'Satış' }, { v: '%98', l: 'Memnuniyet' }].map(s => (
                  <div key={s.l}>
                    <p className="text-xl font-black text-white">{s.v}</p>
                    <p className="text-gray-400 text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AVANTAJLAR ══ */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10">
            Makinam Var&apos;nin avantajları
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md hover:border-[#E67E22]/50 transition-all">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {adv.svg}
                </div>
                <h3 className="font-bold text-sm leading-tight mb-2 text-gray-900">{adv.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500 hidden sm:block">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NASIL ÇALIŞIR ══ */}
      <section id="nasil-calisir" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10">
            Makinam Var ile makinemi nasıl satarım?
          </h2>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden min-h-[320px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80')" }}
              />
              <div className="absolute inset-0" style={{ background: 'rgba(44,62,80,0.45)' }} />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <p className="text-white text-2xl font-black leading-snug mb-1">
                  Anlaşma güvencesi,<br />aynı gün ödeme.
                </p>
                <p className="text-gray-200 text-sm font-medium">
                  Formu doldurun, uzmanımız sizi arasın, nakit teklifinizi alın.
                </p>
              </div>
            </div>

            <div>
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#E67E22]/10 border-2 border-[#E67E22]/30 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                      {step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-gray-300 my-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/sat" className="inline-block bg-[#E67E22] hover:bg-[#D35400] text-white font-bold px-8 py-3.5 rounded-xl transition-colors mt-2">
                Hemen Nakde Çevir →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KARŞILAŞTIRMA TABLOSU ══ */}
      <section id="karsilastirma" className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-3">
            Geleneksel Yöntemle Satmak vs. Makinam Var
          </h2>
          <p className="text-gray-500 text-center mb-10">Neden binlerce makine satıcısı bizi tercih ediyor?</p>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-[#2C3E50] text-white text-sm font-bold">
              <div className="px-4 py-4">Kriter</div>
              <div className="px-4 py-4 text-center border-l border-gray-600">Geleneksel Yöntemle Satmak</div>
              <div className="px-4 py-4 text-center border-l border-gray-600 text-[#F39C12]">Makinam Var ✓</div>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.label}
                className={`grid grid-cols-3 text-sm border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-4 py-4 font-semibold text-gray-700">{row.label}</div>
                <div className="px-4 py-4 text-center text-red-500 border-l border-gray-100">
                  <span className="flex items-center justify-center gap-1">
                    <span>✗</span> {row.onur}
                  </span>
                </div>
                <div className="px-4 py-4 text-center text-[#27AE60] font-semibold border-l border-gray-100">
                  <span className="flex items-center justify-center gap-1">
                    <span>✓</span> {row.us}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MÜŞTERİ YORUMLARI ══ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10">
            Makinesini Makinam Var&apos;de satanlar ne diyor?
          </h2>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* ══ SSS ══ */}
      <section id="sss" className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10">
            Sıkça sorulan sorular
          </h2>
          <FaqSection faqs={faqs} />
        </div>
      </section>

      {/* ══ ALT CTA ══ */}
      <section className="bg-[#2C3E50] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {ctaTitle}
          </h2>
          <p className="text-gray-300 mb-2 text-base sm:text-lg">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sat" className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
              Hemen Nakde Çevir
            </Link>
            <a href="#nasil-calisir" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-10 py-4 rounded-xl text-lg transition-colors">
              Nasıl Çalışır?
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
