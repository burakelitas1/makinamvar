import Link from 'next/link'
import Image from 'next/image'
import FaqSection from '@/components/FaqSection'
import TechnicalPattern from '@/components/TechnicalPattern'
import {
  AbkantPresIllustration,
  GiyotinMakasIllustration,
  PresIllustration,
  SilindirIllustration,
  BoruBukumIllustration,
  TesterelerIllustration,
  FinalCtaPressbrake,
} from '@/components/MachineIllustrations'
import { createServiceClient } from '@/lib/supabase-server'
import {
  Clock, Truck, ShieldCheck, Settings2, ArrowRight, CheckCircle,
} from 'lucide-react'

export const revalidate = 3600

const TRUST_ITEMS = [
  {
    icon: Settings2,
    title: 'Uzman Değerlendirmesi',
    desc: 'Makinenizin teknik bilgileri, durumu ve piyasa koşulları birlikte incelenir.',
  },
  {
    icon: Clock,
    title: '24 Saatte Teklif',
    desc: 'Formu tamamladıktan sonra satın alma teklifiniz en geç 24 saat içinde paylaşılır.',
  },
  {
    icon: Truck,
    title: 'Lojistiği Biz Planlarız',
    desc: 'Anlaşma sağlanırsa söküm, vinç ve nakliye organizasyonunu biz yönetiriz.',
  },
  {
    icon: ShieldCheck,
    title: 'Karar Size Ait',
    desc: 'Teklifi kabul edebilir, reddedebilir veya karşı teklifinizi iletebilirsiniz.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Makinenizi Tanıtın',
    desc: 'Temel bilgileri ve fotoğrafları mevcut form üzerinden paylaşın.',
  },
  {
    num: '02',
    title: 'Uzmanlarımız Değerlendirsin',
    desc: 'Makinenizin teknik durumu ve piyasa koşulları birlikte incelensin.',
  },
  {
    num: '03',
    title: 'Teklifinizi Alın',
    desc: 'Satın alma teklifinizi SMS ve e-posta üzerinden görüntüleyin.',
  },
]

type MachineCategory = {
  title: string
  desc: string
  Illustration: React.ComponentType<{ className?: string }>
}

const MACHINE_CATEGORIES: MachineCategory[] = [
  { Illustration: AbkantPresIllustration,    title: 'Abkant Pres',           desc: 'CNC, hidrolik ve pnömatik abkant presler.' },
  { Illustration: GiyotinMakasIllustration,  title: 'Giyotin Makas',          desc: 'Hidrolik ve mekanik giyotin kesim makineleri.' },
  { Illustration: PresIllustration,          title: 'Pres Makineleri',        desc: 'Eksantrik, hidrolik ve servo pres sistemleri.' },
  { Illustration: SilindirIllustration,      title: 'Silindir Makineleri',    desc: 'Sac kıvırma ve silindir bükme makineleri.' },
  { Illustration: BoruBukumIllustration,     title: 'Boru Büküm Makineleri', desc: 'Boru ve profil şekillendirme sistemleri.' },
  { Illustration: TesterelerIllustration,    title: 'Testereler',             desc: 'Şerit testere ve metal kesim makineleri.' },
]

const COMPARE_ROWS = [
  { label: 'Alıcı bulma',         onur: 'Belirsiz süre',          us: '24 saat içinde teklif' },
  { label: 'Görüşme ve pazarlık', onur: 'Birden fazla alıcıyla',  us: 'Doğrudan Trink ile' },
  { label: 'Lojistik',            onur: 'Satıcı planlar',         us: 'Biz planlarız' },
  { label: 'Ödeme',               onur: 'Alıcıya göre değişir',   us: 'Anlaşma koşullarına göre peşin' },
  { label: 'Karar',               onur: 'İlan süreci başlar',     us: 'Teklif almak taahhüt oluşturmaz' },
]

const DEFAULT_FAQS = [
  { question: 'Teklif almak ücretli mi?', answer: 'Hayır. Değerlendirme ve teklif alma süreci tamamen ücretsizdir. Satış gerçekleşmeden herhangi bir ücret alınmaz.' },
  { question: 'Teklif alınca makinemi satmak zorunda mıyım?', answer: 'Hayır. Teklif almak herhangi bir yükümlülük doğurmaz. Teklifi inceleme, kabul etme, reddetme veya karşı teklif verme kararı tamamen size aittir.' },
  { question: 'Teklif ne kadar sürede hazırlanır?', answer: 'Formu gönderdikten sonra 24 saat içinde size özel profesyonel satın alma teklifi SMS ve e-posta ile iletilir.' },
  { question: 'Hangi makine türlerine teklif veriyorsunuz?', answer: 'Abkant pres, giyotin makas, silindir, pres, boru büküm ve diğer sac işleme makineleri için teklif veriyoruz. Çalışır veya arızalı tüm makineleri değerlendiriyoruz.' },
  { question: 'Fotoğraf eklemek neden gerekli?', answer: 'Makinenizin farklı açılardan fotoğrafları, uzman ekibimizin daha doğru ve hızlı değerlendirme yapmasını sağlar. Daha fazla fotoğraf, daha doğru teklif demektir.' },
  { question: 'Söküm ve nakliye masraflarını kim karşılar?', answer: 'Anlaşma sağlandığında söküm, vinç ve nakliye işlemlerini tamamen biz karşılarız. Sizin herhangi bir masraf yapmanız gerekmez.' },
  { question: 'Bilgilerim gizli tutuluyor mu?', answer: 'Evet. Paylaştığınız tüm bilgiler yalnızca değerlendirme sürecinde kullanılır. Üçüncü taraflarla paylaşılmaz.' },
  { question: 'Teklifi kabul etmezsem ne olur?', answer: 'Hiçbir şey. Teklifi reddetmek veya yanıtsız bırakmak tamamen serbesttir. Herhangi bir yükümlülük doğmaz.' },
  { question: 'Ödeme ne zaman yapılır?', answer: 'Teklifi onayladıktan ve evrak işlemleri tamamlandıktan sonra makine nakliye aracına yüklendiği gün ödeme yapılır.' },
]

export default async function HomePage() {
  const supabase = createServiceClient()

  const [{ data: dbFaqs }] = await Promise.all([
    supabase.from('faqs').select('question,answer').eq('active', true).order('order_num'),
  ])

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
      <section className="relative bg-white border-b border-[#E2E8F0] overflow-hidden">
        <TechnicalPattern id="hero-pattern" color="blue" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-[96px] md:pt-20 md:pb-[96px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3B5BDB]/8 border border-[#3B5BDB]/20 rounded-full px-4 py-1.5 text-[#3B5BDB] text-[11px] font-semibold tracking-widest uppercase mb-8">
                Sac İşleme Makinelerine Ücretsiz Teklif
              </div>
              <h1 className="text-[40px] sm:text-[56px] font-extrabold text-[#0F172A] leading-[46px] sm:leading-[64px] tracking-tight mb-5">
                Makineniz İçin Teklifinizi Öğrenin.
              </h1>
              <p className="text-[18px] text-[#475569] leading-[30px] mb-10 max-w-[480px] font-normal">
                Makinenizin bilgilerini paylaşın. Uzman ekibimiz değerlendirsin ve 24 saat içinde satın alma teklifinizi hazırlasın. Teklifi kabul edip etmemek tamamen size ait.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/sat"
                  className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200"
                >
                  Ücretsiz Teklif Al
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <a
                  href="#nasil-calisir"
                  className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] font-medium px-8 h-[56px] rounded-[16px] text-[16px] transition-colors border border-[#E2E8F0] hover:border-[#CBD5E1]"
                >
                  Nasıl Çalışır?
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10 text-[14px] text-[#475569]">
                {['Ücretsiz', 'Taahhütsüz', '24 Saatte Teklif'].map(t => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" strokeWidth={2} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: press brake illustration (desktop only) */}
            <div className="hidden lg:flex items-center justify-center relative">
              <Image
                src="/abkant-pres-blueprint.png"
                alt="Abkant pres teknik çizim"
                width={520}
                height={520}
                className="w-full max-w-[480px] h-auto"
                priority
              />
              {/* Floating labels */}
              <div className="absolute top-[8%] left-[0%] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">
                  Makine bilgileri
                </span>
              </div>
              <div className="absolute top-[38%] right-[-4%] flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">
                  Uzman değerlendirmesi
                </span>
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
              </div>
              <div className="absolute bottom-[8%] right-[2%] flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">
                  Satın alma teklifi
                </span>
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
              </div>
            </div>
          </div>

          {/* Mobile: simplified machine outline below trust indicators */}
          <div className="lg:hidden flex justify-center mt-10 opacity-30">
            <AbkantPresIllustration className="w-24 h-24" />
          </div>
        </div>
      </section>

      {/* NEDEN TRİNK */}
      <section className="relative bg-[#F8FAFC] py-[96px] overflow-hidden">
        <TechnicalPattern id="trust-pattern" color="blue" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Teklif Sürecini Kolaylaştırıyoruz.</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-2xl">Makinenizi ilan vermeden, alıcı aramadan ve satış kararı almadan değerlendirmeye alın.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-0.5 hover:shadow-sm hover:border-[#3B5BDB]/30 transition-all duration-200 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3B5BDB]/8 flex items-center justify-center mb-6 flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#3B5BDB]" strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-3 text-[16px] leading-snug">{title}</h3>
                <p className="text-[14px] text-[#475569] leading-[22px] mt-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="bg-white py-[96px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Nasıl Çalışır?</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-md">Yaklaşık 3 dakikalık form. 24 saat içinde satın alma teklifi.</p>
          </div>
          <div className="relative grid md:grid-cols-3 gap-12 mb-12">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-[#3B5BDB]/10 font-extrabold text-[80px] leading-none mb-6 select-none">{step.num}</div>
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
      <section id="makineler" className="relative bg-[#F8FAFC] py-[96px] overflow-hidden">
        <TechnicalPattern id="machine-pattern" color="blue" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Hangi Makinelere Teklif Veriyoruz?</h2>
            <p className="text-[18px] text-[#475569] leading-[30px] max-w-2xl">Türkiye genelindeki ikinci el sac işleme makinelerini değerlendiriyor ve satın alma teklifi sunuyoruz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MACHINE_CATEGORIES.map(({ Illustration, title, desc }) => (
              <Link
                key={title}
                href="/sat"
                className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-0.5 hover:shadow-sm hover:border-[#3B5BDB]/30 transition-all duration-200 group flex flex-col"
              >
                <div className="w-14 h-14 mb-6 flex-shrink-0">
                  <Illustration className="w-full h-full" />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-2 text-[18px] leading-snug">{title}</h3>
                <p className="text-[14px] text-[#475569] leading-[22px] mb-6 flex-1">{desc}</p>
                <span className="text-[14px] text-[#3B5BDB] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200 mt-auto">
                  Ücretsiz Teklif Al <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section className="bg-white py-[96px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">İlan Vermekle Trink'ten Teklif Almak Arasındaki Fark</h2>
            <p className="text-[18px] text-[#475569] leading-[30px]">Satış kararı vermeden önce iki yöntemi karşılaştırın.</p>
          </div>
          <div className="overflow-x-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden min-w-[560px]">
              <div className="grid grid-cols-3">
                <div className="px-8 py-4 text-[12px] font-medium text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]" />
                <div className="px-8 py-4 text-[12px] font-medium text-[#475569] uppercase tracking-wider text-center border-l border-b border-[#E2E8F0]">İlanla Satış</div>
                <div className="px-8 py-4 text-[12px] font-medium text-[#3B5BDB] uppercase tracking-wider text-center border-l border-b border-[#E2E8F0]">Trink'ten Teklif</div>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 border-b border-[#E2E8F0] last:border-0 ${i % 2 === 1 ? 'bg-[#F8FAFC]' : ''}`}>
                  <div className="px-8 py-5 text-[14px] font-medium text-[#0F172A]">{row.label}</div>
                  <div className="px-8 py-5 text-[14px] text-[#475569] text-center border-l border-[#E2E8F0]">{row.onur}</div>
                  <div className="px-8 py-5 text-[14px] text-[#3B5BDB] font-medium text-center border-l border-[#E2E8F0]">{row.us}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="bg-[#F8FAFC] py-[96px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Sık Sorulan Sorular</h2>
            <p className="text-[18px] text-[#475569] leading-[30px]">Aklınızdaki soruları yanıtlayalım.</p>
          </div>
          <div className="max-w-2xl">
            <FaqSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ALT CTA */}
      <section className="relative bg-[#0F172A] py-[80px] overflow-hidden">
        <TechnicalPattern id="cta-pattern" color="navy" />
        {/* Large decorative press brake (right side, desktop only) */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <FinalCtaPressbrake className="w-[200px] h-auto opacity-[0.08]" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <h2 className="text-[42px] font-bold text-white leading-[50px] mb-5 max-w-xl">
            Makineniz İçin Teklifinizi Öğrenin.
          </h2>
          <p className="text-[18px] text-[#94A3B8] leading-[30px] mb-10 max-w-md">
            Ücretsiz formu tamamlayın. Teklifinizi görün, kararınızı daha sonra verin.
          </p>
          <Link
            href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200"
          >
            Ücretsiz Teklif Al
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  )
}
