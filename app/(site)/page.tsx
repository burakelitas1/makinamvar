import Link from 'next/link'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FaqSection from '@/components/FaqSection'
import { createServiceClient } from '@/lib/supabase-server'
import { Clock, Truck, ShieldCheck, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

export const revalidate = 3600

const TRUST_ITEMS = [
  {
    icon: BarChart3,
    title: 'Gerçek Piyasa Değeri',
    desc: 'Uzman ekibimiz makinenizi piyasa verilerine göre değerlendirir. Tahminden değil, gerçek veriden yola çıkar.',
  },
  {
    icon: Clock,
    title: '24 Saatte Profesyonel Teklif',
    desc: 'Formu gönderdikten sonra 24 saat içinde size özel bir satın alma teklifi iletilir. Bekleme yok.',
  },
  {
    icon: Truck,
    title: 'Söküm ve Nakliye Bizden',
    desc: 'Anlaşma sağlandığında söküm, vinç ve nakliye tamamen tarafımızca karşılanır. Herhangi bir masraf yapmazsınız.',
  },
  {
    icon: ShieldCheck,
    title: 'Taahhütsüz ve Ücretsiz',
    desc: 'Teklif almak hiçbir yükümlülük doğurmaz. Teklifi kabul edip etmemek tamamen sizin kararınız.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Makinenizi tanıtın',
    desc: 'Makine türünü, teknik özelliklerini ve fotoğraflarını paylaşın. Form ortalama 3 dakika sürer.',
  },
  {
    num: '02',
    title: 'Uzman değerlendirmesi alın',
    desc: 'Teknik ekibimiz makinenizi inceler. 24 saat içinde size özel satın alma teklifi SMS ve e-posta ile iletilir.',
  },
  {
    num: '03',
    title: 'Kararınızı verin',
    desc: 'Teklifi değerlendirin. Kabul ederseniz söküm ve nakliye tarafımızca organize edilir, ödeme aynı gün yapılır.',
  },
]

const COMPARE_ROWS = [
  { label: 'Alıcı Bulma',      onur: 'Haftalar / aylar',          us: '24 saat içinde teklif' },
  { label: 'Lojistik',         onur: 'Satıcı organize eder',       us: 'Tamamen bizim üstümüzde' },
  { label: 'Ödeme',            onur: 'Belirsiz, vadeli',           us: 'Aynı gün, peşin' },
  { label: 'Söküm / Nakliye',  onur: 'Satıcıya ait maliyet',      us: 'Ücretsiz' },
  { label: 'Taahhüt',         onur: 'İlan verince bağlanırsınız', us: 'Teklif alma taahhütsüzdür' },
]

const DEFAULT_FAQS = [
  { question: 'Trink Makina nedir?', answer: 'Trink Makina, sac işleme makinelerinin değerini belirleyip profesyonel satın alma teklifi sunan dijital bir platformdur. Geleneksel ikinci el pazarlarından farklı olarak makine sahiplerini alıcıyla biz buluştururuz.' },
  { question: 'Hangi makineler için teklif alabilirsiniz?', answer: 'Abkant pres, giyotin makas, silindir, pres, boru büküm ve diğer sac işleme makineleri için teklif alabilirsiniz. Çalışır veya arızalı tüm makineleri değerlendiriyoruz.' },
  { question: 'Söküm ve nakliye gerçekten ücretsiz mi?', answer: 'Evet. Anlaşma sağlandığında söküm, vinç ve nakliye işlemlerini tamamen biz karşılarız. Sizin herhangi bir masraf yapmanız gerekmez.' },
  { question: 'Teklif almak beni bağlar mı?', answer: 'Hayır. Teklif almak herhangi bir yükümlülük doğurmaz. Teklifi inceleme, kabul etme, reddetme veya karşı teklif verme kararı tamamen size aittir.' },
  { question: 'Bu hizmet ücretli mi?', answer: 'Değerlendirme ve teklif alma süreci tamamen ücretsizdir. Satış gerçekleşmeden herhangi bir ücret alınmaz.' },
  { question: 'Ödeme ne zaman yapılır?', answer: 'Teklifi onayladıktan ve evrak işlemleri tamamlandıktan sonra makine nakliye aracına yüklendiği gün ödeme yapılır.' },
]

export default async function HomePage() {
  const supabase = createServiceClient()

  const [{ data: dbTestimonials }, { data: dbFaqs }] = await Promise.all([
    supabase.from('testimonials').select('name,detail,text,date').eq('active', true).order('order_num'),
    supabase.from('faqs').select('question,answer').eq('active', true).order('order_num'),
  ])

  const testimonials = dbTestimonials ?? []
  const faqs = (dbFaqs && dbFaqs.length > 0) ? dbFaqs : DEFAULT_FAQS

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="inline-flex items-center gap-2 bg-[#3B5BDB]/8 border border-[#3B5BDB]/20 rounded-full px-4 py-1.5 text-[#3B5BDB] text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-[#3B5BDB] rounded-full" />
            Endüstriyel Değerleme Platformu
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1.1] tracking-tight mb-6 max-w-3xl">
            Makinenizin gerçek<br />değerini öğrenin.
          </h1>
          <p className="text-lg sm:text-xl text-[#475569] leading-relaxed mb-10 max-w-xl">
            Teklif almak herhangi bir taahhüt gerektirmez.<br />
            Sadece değeri öğrenin. Karar tamamen size ait.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Ücretsiz Değerlendirme Talebi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#nasil-calisir" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] font-medium px-7 py-3.5 rounded-xl text-base transition-colors border border-[#E2E8F0] hover:border-[#0F172A]/20">
              Nasıl çalışır?
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-[#475569]">
            {['Tamamen ücretsiz', 'Taahhüt yok', '24 saatte sonuç', 'Söküm bizden'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GÜVEN */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">Neden Trink?</h2>
            <p className="text-[#475569] max-w-md mx-auto">Geleneksel yöntemlerin belirsizliğini kaldırıyoruz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#3B5BDB]/8 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#3B5BDB]" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-2 text-sm leading-snug">{title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">Üç adımda profesyonel teklif</h2>
            <p className="text-[#475569] max-w-md mx-auto">Ortalama 3 dakikalık bir form, 24 saatte somut bir değer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="text-[#3B5BDB]/15 font-black text-6xl leading-none mb-4 select-none">{step.num}</div>
                <h3 className="font-semibold text-[#0F172A] text-base mb-2">{step.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Değerlendirme Talebi Oluştur
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">Trink vs. Geleneksel Yöntemler</h2>
            <p className="text-[#475569]">Fark neden önemlidir.</p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 border-b border-[#E2E8F0]">
              <div className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider"></div>
              <div className="px-5 py-3.5 text-xs font-semibold text-[#475569] uppercase tracking-wider text-center border-l border-[#E2E8F0]">Geleneksel</div>
              <div className="px-5 py-3.5 text-xs font-semibold text-[#3B5BDB] uppercase tracking-wider text-center border-l border-[#E2E8F0]">Trink</div>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 border-b border-[#E2E8F0] last:border-0 ${i % 2 === 1 ? 'bg-[#F8FAFC]' : ''}`}>
                <div className="px-5 py-4 text-sm font-medium text-[#0F172A]">{row.label}</div>
                <div className="px-5 py-4 text-sm text-[#475569] text-center border-l border-[#E2E8F0]">{row.onur}</div>
                <div className="px-5 py-4 text-sm text-[#3B5BDB] font-medium text-center border-l border-[#E2E8F0]">{row.us}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÜŞTERİ YORUMLARI */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">Müşterilerimiz ne diyor?</h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* SSS */}
      <section id="sss" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">Sık sorulan sorular</h2>
            <p className="text-[#475569]">Aklınızdaki soruları yanıtlayalım.</p>
          </div>
          <FaqSection faqs={faqs} />
        </div>
      </section>

      {/* ALT CTA */}
      <section className="bg-[#0F172A] py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Makinenizin değerini merak mı ediyorsunuz?
          </h2>
          <p className="text-[#94A3B8] mb-8 text-base">
            Teklif almak taahhüt gerektirmez. Sadece formu doldurun, biz değerlendiririz.
          </p>
          <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
            Ücretsiz Değerlendirme Talebi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
