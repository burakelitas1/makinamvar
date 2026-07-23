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
    title: '24 Saatte Teklif',
    desc: 'Formu gönderdikten sonra 24 saat içinde size özel satın alma teklifi iletilir.',
  },
  {
    icon: Truck,
    title: 'Söküm Bizden',
    desc: 'Anlaşma sağlandığında söküm, vinç ve nakliye tamamen tarafımızca karşılanır.',
  },
  {
    icon: ShieldCheck,
    title: 'Taahhüt Yok',
    desc: 'Teklif almak hiçbir yükümlülük doğurmaz. Kabul edip etmemek tamamen sizin kararınız.',
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
    title: 'Uzman değerlendirmesi',
    desc: 'Teknik ekibimiz makinenizi inceler. 24 saat içinde size özel teklif SMS ve e-posta ile iletilir.',
  },
  {
    num: '03',
    title: 'Kararınızı verin',
    desc: 'Teklifi değerlendirin. Kabul ederseniz söküm ve nakliye organize edilir, ödeme aynı gün yapılır.',
  },
]

const COMPARE_ROWS = [
  { label: 'Alıcı Bulma',     onur: 'Haftalar / aylar',          us: '24 saat içinde teklif' },
  { label: 'Lojistik',        onur: 'Satıcı organize eder',       us: 'Tamamen bizim üstümüzde' },
  { label: 'Ödeme',           onur: 'Belirsiz, vadeli',           us: 'Aynı gün, peşin' },
  { label: 'Söküm / Nakliye', onur: 'Satıcıya ait maliyet',      us: 'Ücretsiz' },
  { label: 'Taahhüt',        onur: 'İlan verince bağlanırsınız', us: 'Teklif alma taahhütsüzdür' },
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
        <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-[120px] md:pt-28">
          <div className="inline-flex items-center gap-2 bg-[#3B5BDB]/8 border border-[#3B5BDB]/20 rounded-full px-4 py-1.5 text-[#3B5BDB] text-[12px] font-medium tracking-wider uppercase mb-10">
            Endüstriyel Değerleme Platformu
          </div>
          <h1 className="text-[40px] sm:text-[64px] font-extrabold text-[#0F172A] leading-[46px] sm:leading-[72px] tracking-tight mb-6 max-w-3xl">
            Makinenizin Değerini<br />Ücretsiz Öğrenin
          </h1>
          <p className="text-[18px] text-[#475569] leading-[30px] mb-10 max-w-[480px] font-normal">
            Teklif almak herhangi bir taahhüt gerektirmez.
            <br />Sadece değeri öğrenin. Karar tamamen size ait.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/sat"
              className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-8 h-[56px] rounded-[16px] text-[16px] transition-colors"
            >
              Ücretsiz Teklif Al
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#nasil-calisir"
              className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] font-medium px-8 h-[56px] rounded-[16px] text-[16px] transition-colors border border-[#E2E8F0] hover:border-[#CBD5E1]"
            >
              Nasıl Çalışır
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10 text-[14px] text-[#475569]">
            {['Tamamen ücretsiz', 'Taahhüt yok', '24 saatte sonuç', 'Söküm bizden'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GÜVEN */}
      <section className="bg-[#F8FAFC] py-[120px] md:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Neden Trink?</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Geleneksel yöntemlerin belirsizliğini kaldırıyoruz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#3B5BDB]/8 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#3B5BDB]" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-3 text-[16px] leading-snug">{title}</h3>
                <p className="text-[14px] text-[#475569] leading-[22px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="bg-white py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Üç adımda teklif</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Ortalama 3 dakikalık form. 24 saatte somut değer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="text-[#3B5BDB]/12 font-extrabold text-[80px] leading-none mb-6 select-none">{step.num}</div>
                <h3 className="font-semibold text-[#0F172A] text-[20px] leading-[28px] mb-3">{step.title}</h3>
                <p className="text-[16px] text-[#475569] leading-[28px]">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-8 h-[56px] rounded-[16px] text-[16px] transition-colors"
          >
            Teklifimi Öğren
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section className="bg-[#F8FAFC] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Trink vs. Geleneksel</h2>
            <p className="text-[18px] text-[#475569] leading-[30px]">Fark neden önemlidir.</p>
          </div>
          <div className="max-w-3xl bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-[#E2E8F0]">
              <div className="px-6 py-4 text-[12px] font-medium text-[#475569] uppercase tracking-wider"></div>
              <div className="px-6 py-4 text-[12px] font-medium text-[#475569] uppercase tracking-wider text-center border-l border-[#E2E8F0]">Geleneksel</div>
              <div className="px-6 py-4 text-[12px] font-medium text-[#3B5BDB] uppercase tracking-wider text-center border-l border-[#E2E8F0]">Trink</div>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 border-b border-[#E2E8F0] last:border-0 ${i % 2 === 1 ? 'bg-[#F8FAFC]' : ''}`}>
                <div className="px-6 py-4 text-[14px] font-medium text-[#0F172A]">{row.label}</div>
                <div className="px-6 py-4 text-[14px] text-[#475569] text-center border-l border-[#E2E8F0]">{row.onur}</div>
                <div className="px-6 py-4 text-[14px] text-[#3B5BDB] font-medium text-center border-l border-[#E2E8F0]">{row.us}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÜŞTERİ YORUMLARI */}
      {testimonials.length > 0 && (
        <section className="bg-white py-[120px]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px]">Müşterilerimiz ne diyor?</h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* SSS */}
      <section id="sss" className="bg-[#F8FAFC] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Sık sorulan sorular</h2>
            <p className="text-[18px] text-[#475569] leading-[30px]">Aklınızdaki soruları yanıtlayalım.</p>
          </div>
          <div className="max-w-2xl">
            <FaqSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ALT CTA */}
      <section className="bg-[#0F172A] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-[42px] font-bold text-white leading-[50px] mb-6 max-w-xl">
            Makinenizin değerini merak mı ediyorsunuz?
          </h2>
          <p className="text-[18px] text-[#94A3B8] leading-[30px] mb-10 max-w-md">
            Teklif almak taahhüt gerektirmez. Formu doldurun, biz değerlendiririz.
          </p>
          <Link
            href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-semibold px-8 h-[56px] rounded-[16px] text-[16px] transition-colors"
          >
            Ücretsiz Teklif Al
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
