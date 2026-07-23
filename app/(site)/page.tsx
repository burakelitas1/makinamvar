import Link from 'next/link'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FaqSection from '@/components/FaqSection'
import { createServiceClient } from '@/lib/supabase-server'
import {
  Clock, Truck, ShieldCheck, BarChart3, ArrowRight, CheckCircle,
  Scissors, Layers, MoveDown, RefreshCw, GitBranch, Zap,
} from 'lucide-react'

export const revalidate = 3600

const TRUST_ITEMS = [
  {
    icon: BarChart3,
    title: 'Gerçek Piyasa Değeri',
    desc: 'Uzman ekibimiz piyasa verileriyle makinenizi değerlendirir. Tahminden değil, gerçek veriden yola çıkar.',
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
    title: 'Makinenizi Tanıyalım',
    desc: 'Makinenizin temel bilgilerini paylaşın. Form ortalama 3 dakika sürer.',
  },
  {
    num: '02',
    title: 'Uzmanlarımız Değerlendirsin',
    desc: 'Uzmanlarımız piyasa verileriyle birlikte makinenizi değerlendirsin.',
  },
  {
    num: '03',
    title: 'Profesyonel Teklifinizi Alın',
    desc: 'Size özel profesyonel satın alma teklifiniz SMS ve e-posta ile iletilir.',
  },
]

const MACHINE_CATEGORIES = [
  {
    icon: Layers,
    title: 'Abkant Pres',
    desc: 'Hidrolik, pnömatik ve CNC abkant presler.',
  },
  {
    icon: Scissors,
    title: 'Giyotin Makas',
    desc: 'Hidrolik ve mekanik giyotin makas makineleri.',
  },
  {
    icon: MoveDown,
    title: 'Pres Makineleri',
    desc: 'Eksantrik, hidrolik ve servo pres makineleri.',
  },
  {
    icon: RefreshCw,
    title: 'Silindir Makineleri',
    desc: 'Sac kıvırma ve silindir bükme makineleri.',
  },
  {
    icon: GitBranch,
    title: 'Boru Büküm',
    desc: 'Boru ve profil bükme makineleri.',
  },
  {
    icon: Zap,
    title: 'Testereler',
    desc: 'Metal kesme ve şerit testere makineleri.',
  },
]

const CASE_STUDIES = [
  {
    machine: 'Durma AD-S 3080',
    category: 'Abkant Pres',
    city: 'İstanbul',
    industry: 'Metal İşleme',
    time: '18 saat',
    outcome: 'Profesyonel teklif iletildi',
  },
  {
    machine: 'Ermaksan FBD 10025',
    category: 'Giyotin Makas',
    city: 'Bursa',
    industry: 'Otomotiv',
    time: '22 saat',
    outcome: 'Satın alma gerçekleşti',
  },
  {
    machine: 'RAS 72.22',
    category: 'Silindir',
    city: 'Konya',
    industry: 'Makine İmalatı',
    time: '16 saat',
    outcome: 'Teklif kabul edildi',
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
  { question: 'Teklif almak ücretli mi?', answer: 'Hayır. Değerlendirme ve teklif alma süreci tamamen ücretsizdir. Satış gerçekleşmeden herhangi bir ücret alınmaz.' },
  { question: 'Makinemi satmak zorunda mıyım?', answer: 'Hayır. Teklif almak herhangi bir yükümlülük doğurmaz. Teklifi inceleme, kabul etme, reddetme veya karşı teklif verme kararı tamamen size aittir.' },
  { question: 'Teklif ne kadar sürede hazırlanır?', answer: 'Formu gönderdikten sonra 24 saat içinde size özel profesyonel satın alma teklifi SMS ve e-posta ile iletilir.' },
  { question: 'Hangi makine türlerini değerlendiriyorsunuz?', answer: 'Abkant pres, giyotin makas, silindir, pres, boru büküm ve diğer sac işleme makineleri için teklif alabilirsiniz. Çalışır veya arızalı tüm makineleri değerlendiriyoruz.' },
  { question: 'Söküm ve nakliye gerçekten ücretsiz mi?', answer: 'Evet. Anlaşma sağlandığında söküm, vinç ve nakliye işlemlerini tamamen biz karşılarız. Sizin herhangi bir masraf yapmanız gerekmez.' },
  { question: 'Bilgilerim gizli kalıyor mu?', answer: 'Evet. Paylaştığınız tüm bilgiler yalnızca değerlendirme sürecinde kullanılır. Üçüncü taraflarla paylaşılmaz.' },
  { question: 'Teklifi kabul etmezsem ne olur?', answer: 'Hiçbir şey. Teklifi reddetmek veya yanıtsız bırakmak tamamen serbesttir. Herhangi bir yükümlülük doğmaz.' },
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
            Makinenizin Gerçek<br />Piyasa Değerini Öğrenin
          </h1>
          <p className="text-[18px] text-[#475569] leading-[30px] mb-10 max-w-[480px] font-normal">
            Teklif almak ücretsizdir.
            <br />Karar tamamen size aittir.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/sat"
              className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200"
            >
              Profesyonel Teklif Al
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <a
              href="#nasil-calisir"
              className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] font-medium px-8 h-[56px] rounded-[16px] text-[16px] transition-colors border border-[#E2E8F0] hover:border-[#CBD5E1]"
            >
              Nasıl Çalışıyor?
            </a>
          </div>
          <div className="flex items-center gap-8 mt-10 text-[14px] text-[#475569]">
            {['Ücretsiz', 'Taahhütsüz', '24 Saat'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" strokeWidth={2} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GÜVEN */}
      <section className="bg-[#F8FAFC] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Neden Trink?</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Geleneksel yöntemlerin belirsizliğini kaldırıyoruz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#3B5BDB]/8 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#3B5BDB]" strokeWidth={2} />
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
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Nasıl Çalışıyoruz?</h2>
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
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200"
          >
            Ücretsiz Teklif Al
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* MAKİNE KATEGORİLERİ */}
      <section className="bg-[#F8FAFC] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Hangi Makineleri Değerlendiriyoruz?</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Sac işleme makinelerinin tüm kategorilerini kapsıyoruz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {MACHINE_CATEGORIES.map(({ icon: Icon, title, desc }) => (
              <Link
                key={title}
                href="/sat"
                className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3B5BDB]/8 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#3B5BDB]" strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-2 text-[18px] leading-snug">{title}</h3>
                <p className="text-[14px] text-[#475569] leading-[22px] mb-4">{desc}</p>
                <span className="text-[14px] text-[#3B5BDB] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Teklif Al <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEDEN TRİNK — KARŞILAŞTIRMA */}
      <section className="bg-white py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Şeffaf Satın Alma Süreci</h2>
            <p className="text-[18px] text-[#475569] leading-[30px]">Geleneksel yöntemlerden farkımız.</p>
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

      {/* CASE STUDIES */}
      <section className="bg-[#F8FAFC] py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Tamamlanan Değerlendirmeler</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Gerçek makineler. Gerçek teklifler.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.machine} className="bg-white border border-[#E2E8F0] rounded-[20px] p-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3B5BDB]/8 text-[#3B5BDB] text-[12px] font-medium mb-6">
                  {cs.category}
                </div>
                <h3 className="font-semibold text-[#0F172A] text-[18px] leading-[26px] mb-6">{cs.machine}</h3>
                <dl className="space-y-3">
                  {[
                    { label: 'Şehir', value: cs.city },
                    { label: 'Sektör', value: cs.industry },
                    { label: 'Teklif Süresi', value: cs.time },
                    { label: 'Sonuç', value: cs.outcome },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-[14px]">
                      <dt className="text-[#94A3B8] font-medium">{label}</dt>
                      <dd className="text-[#0F172A] font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
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
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Süreç Hakkında Merak Ettikleriniz</h2>
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
            Karar sizin. Değerleme bizden.
          </p>
          <Link
            href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200"
          >
            Profesyonel Teklif Al
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  )
}
