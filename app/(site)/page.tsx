import Link from 'next/link'
import Image from 'next/image'
import FaqSection from '@/components/FaqSection'
import ScrollReveal from '@/components/ScrollReveal'
import { createServiceClient } from '@/lib/supabase-server'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'

export const revalidate = 3600

const TRUST_ITEMS = [
  { img: '/07_uzman_degerlendirmesi.png', title: 'Uzman Değerlendirmesi', desc: 'Makinenizin teknik bilgileri, durumu ve piyasa koşulları birlikte incelenir.' },
  { img: '/08_24_saatte_teklif.png',      title: '24 Saatte Teklif',       desc: 'Formu tamamladıktan sonra satın alma teklifiniz en geç 24 saat içinde paylaşılır.' },
  { img: '/09_lojistik.png',              title: 'Lojistiği Biz Planlarız', desc: 'Anlaşma sağlanırsa söküm, vinç ve nakliye organizasyonunu biz yönetiriz.' },
  { img: '/10_karar_size_ait.png',        title: 'Karar Size Ait',         desc: 'Teklifi kabul edebilir, reddedebilir veya karşı teklifinizi iletebilirsiniz.' },
]

const STEPS = [
  { num: '01', title: 'Makinenizi Tanıtın',         desc: 'Temel bilgileri ve fotoğrafları mevcut form üzerinden paylaşın.' },
  { num: '02', title: 'Uzmanlarımız Değerlendirsin', desc: 'Makinenizin teknik durumu ve piyasa koşulları birlikte incelensin.' },
  { num: '03', title: 'Teklifinizi Alın',            desc: 'Satın alma teklifinizi SMS ve e-posta üzerinden görüntüleyin.' },
]

const MACHINE_CATEGORIES = [
  { img: '/01_abkant_pres.png',       title: 'Abkant Pres',           desc: 'CNC, hidrolik ve pnömatik abkant presler.' },
  { img: '/02_giyotin_makas.png',     title: 'Giyotin Makas',          desc: 'Hidrolik ve mekanik giyotin kesim makineleri.' },
  { img: '/03_pres_makinesi.png',     title: 'Pres Makineleri',        desc: 'Eksantrik, hidrolik ve servo pres sistemleri.' },
  { img: '/04_silindir_makinesi.png', title: 'Silindir Makineleri',    desc: 'Sac kıvırma ve silindir bükme makineleri.' },
  { img: '/05_boru_bukum.png',        title: 'Boru Büküm Makineleri', desc: 'Boru ve profil şekillendirme sistemleri.' },
  { img: '/06_serit_testere.png',     title: 'Testereler',             desc: 'Şerit testere ve metal kesim makineleri.' },
]

const COMPARE_ROWS = [
  { label: 'Alıcı bulma',         onur: 'Belirsiz süre',         us: '24 saat içinde teklif' },
  { label: 'Görüşme ve pazarlık', onur: 'Birden fazla alıcıyla', us: 'Doğrudan Trink ile' },
  { label: 'Lojistik',            onur: 'Satıcı planlar',        us: 'Biz planlarız' },
  { label: 'Ödeme',               onur: 'Alıcıya göre değişir', us: 'Anlaşma koşullarına göre peşin' },
  { label: 'Karar',               onur: 'İlan süreci başlar',   us: 'Teklif almak taahhüt oluşturmaz' },
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

  const [
    { data: dbFaqs },
    { data: testimonials },
    { count: soldCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase.from('faqs').select('question,answer').eq('active', true).order('order_num'),
    supabase.from('testimonials').select('*').eq('active', true).order('date', { ascending: false }).limit(6),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'satildi'),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
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

  const BASE_TOTAL = 340
  const BASE_SOLD  = 127
  const stats = [
    { value: `${(totalCount ?? 0) + BASE_TOTAL}+`, label: 'Değerlendirilen Makine' },
    { value: '7 sa',                                label: 'Ortalama Teklif Süresi' },
    { value: `${(soldCount ?? 0) + BASE_SOLD}+`,   label: 'Tamamlanan Satış' },
    { value: '%100',                                label: 'Ücretsiz Değerlendirme' },
  ]

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-[#E2E8F0] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image src="/11_blueprint_grid_light.png" alt="" fill className="object-cover opacity-40" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-[96px] md:pt-20 md:pb-[96px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal direction="up">
                <div className="inline-flex items-center gap-2 bg-[#3B5BDB]/8 border border-[#3B5BDB]/20 rounded-full px-4 py-1.5 text-[#3B5BDB] text-[11px] font-semibold tracking-widest uppercase mb-8">
                  Sac İşleme Makinelerine Ücretsiz Teklif
                </div>
                <h1 className="text-[40px] sm:text-[56px] font-extrabold text-[#0F172A] leading-[46px] sm:leading-[64px] tracking-tight mb-5">
                  Makinanızın Güncel Değerini Öğrenin.
                </h1>
                <p className="text-[18px] text-[#475569] leading-[30px] mb-10 max-w-[480px]">
                  Makinenizin bilgilerini paylaşın. Uzman ekibimiz değerlendirsin ve 24 saat içinde satın alma teklifinizi hazırlasın. Teklifi kabul edip etmemek tamamen size ait.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200">
                    Ücretsiz Teklif Al
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                  <a href="#nasil-calisir" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] font-medium px-8 h-[56px] rounded-[16px] text-[16px] transition-colors border border-[#E2E8F0] hover:border-[#CBD5E1]">
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
              </ScrollReveal>
            </div>

            <ScrollReveal direction="right" delay={150} className="hidden lg:flex items-center justify-center relative">
              <Image
                src="/13_abkant_hero_transparent.png"
                alt="Abkant pres teknik çizim"
                width={520}
                height={520}
                className="w-full max-w-[480px] h-auto"
                priority
              />
              <div className="absolute top-[8%] left-[0%] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">Makine bilgileri</span>
              </div>
              <div className="absolute top-[38%] right-[-4%] flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">Uzman değerlendirmesi</span>
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
              </div>
              <div className="absolute bottom-[8%] right-[2%] flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#3B5BDB] tracking-wider uppercase bg-white/90 rounded-full px-3 py-1 border border-[#3B5BDB]/20">Satın alma teklifi</span>
                <div className="w-2 h-2 rounded-full bg-[#3B5BDB]" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-[#3B5BDB] py-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/20">
            {stats.map(({ value, label }, i) => (
              <ScrollReveal key={label} direction="up" delay={i * 80} className="text-center lg:px-8">
                <div className="text-[32px] sm:text-[40px] font-extrabold text-white leading-none mb-1">{value}</div>
                <div className="text-[13px] text-white/70 font-medium">{label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEDEN TRİNK ──────────────────────────────────────── */}
      <section className="relative bg-[#F8FAFC] py-[96px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image src="/11_blueprint_grid_light.png" alt="" fill className="object-cover opacity-30" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="mb-14">
              <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Teklif Sürecini Kolaylaştırıyoruz.</h2>
              <p className="text-[18px] text-[#475569] leading-[30px] max-w-2xl">Makinenizi ilan vermeden, alıcı aramadan ve satış kararı almadan değerlendirmeye alın.</p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ img, title, desc }, i) => (
              <ScrollReveal key={title} direction="up" delay={i * 80}>
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-1 hover:shadow-md hover:border-[#3B5BDB]/30 transition-all duration-300 flex flex-col h-full group">
                  <div className="w-14 h-14 mb-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Image src={img} alt={title} width={56} height={56} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-3 text-[16px] leading-snug">{title}</h3>
                  <p className="text-[14px] text-[#475569] leading-[22px] mt-auto">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ────────────────────────────────────── */}
      <section id="nasil-calisir" className="bg-white py-[96px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Sol: metin */}
            <div>
              <ScrollReveal direction="up">
                <div className="mb-12">
                  <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Nasıl Çalışır?</h2>
                  <p className="text-[18px] text-[#475569] leading-[30px]">Yaklaşık 3 dakikalık form. 24 saat içinde satın alma teklifi.</p>
                </div>
              </ScrollReveal>
              <div className="space-y-10 mb-12">
                {STEPS.map((step, i) => (
                  <ScrollReveal key={step.num} direction="up" delay={i * 100}>
                    <div className="flex gap-6 items-start">
                      <div className="text-[#3B5BDB]/12 font-extrabold text-[56px] leading-none select-none w-16 flex-shrink-0">{step.num}</div>
                      <div className="pt-1">
                        <h3 className="font-semibold text-[#0F172A] text-[20px] leading-[28px] mb-2">{step.title}</h3>
                        <p className="text-[16px] text-[#475569] leading-[28px]">{step.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <ScrollReveal direction="up" delay={100}>
                <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200">
                  Ücretsiz Teklif Al
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </ScrollReveal>
            </div>

            {/* Sağ: makine fotoğrafı */}
            <ScrollReveal direction="right" delay={120} className="hidden lg:block">
              <div className="relative rounded-[24px] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
                <Image
                  src="/abkant.png"
                  alt="Abkant pres değerlendirme süreci"
                  width={620}
                  height={480}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent px-8 py-6">
                  <p className="text-white font-semibold text-[15px]">Uzman gözüyle değerlendirme</p>
                  <p className="text-white/70 text-[13px] mt-1">Her makine teknik durumuna göre ayrıca incelenir.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── MAKİNE KATEGORİLERİ ─────────────────────────────── */}
      <section id="makineler" className="relative bg-[#F8FAFC] py-[96px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image src="/11_blueprint_grid_light.png" alt="" fill className="object-cover opacity-30" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="mb-14">
              <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Hangi Makinelere Teklif Veriyoruz?</h2>
              <p className="text-[18px] text-[#475569] leading-[30px] max-w-2xl">Türkiye genelindeki ikinci el sac işleme makinelerini değerlendiriyor ve satın alma teklifi sunuyoruz.</p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MACHINE_CATEGORIES.map(({ img, title, desc }, i) => (
              <ScrollReveal key={title} direction="up" delay={i * 60}>
                <Link href="/sat" className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-1 hover:shadow-md hover:border-[#3B5BDB]/30 transition-all duration-300 group flex flex-col h-full">
                  <div className="w-16 h-16 mb-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Image src={img} alt={title} width={64} height={64} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-2 text-[18px] leading-snug">{title}</h3>
                  <p className="text-[14px] text-[#475569] leading-[22px] mb-6 flex-1">{desc}</p>
                  <span className="text-[14px] text-[#3B5BDB] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200 mt-auto">
                    Ücretsiz Teklif Al <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÜŞTERİ YORUMLARI ────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-white py-[96px]">
          <div className="max-w-[1280px] mx-auto px-6">
            <ScrollReveal direction="up">
              <div className="mb-14">
                <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Müşterilerimiz Ne Diyor?</h2>
                <p className="text-[18px] text-[#475569] leading-[30px]">Trink ile çalışan makine sahiplerinin deneyimleri.</p>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t: { id: string; name: string; detail: string; text: string; date: string }, i: number) => (
                <ScrollReveal key={t.id} direction="up" delay={i * 70}>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-8 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      ))}
                    </div>
                    <p className="text-[15px] text-[#475569] leading-[26px] flex-1 mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-9 h-9 rounded-full bg-[#3B5BDB]/10 flex items-center justify-center text-[#3B5BDB] font-bold text-sm flex-shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A] text-[14px]">{t.name}</p>
                        {t.detail && <p className="text-[#22C55E] text-[12px]">{t.detail}</p>}
                        {t.date && <p className="text-[#94A3B8] text-[11px]">{t.date}</p>}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── KARŞILAŞTIRMA ────────────────────────────────────── */}
      <section className={`py-[96px] ${testimonials && testimonials.length > 0 ? 'bg-[#F8FAFC]' : 'bg-white'}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="mb-12">
              <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">İlan Vermekle Trink'ten Teklif Almak Arasındaki Fark</h2>
              <p className="text-[18px] text-[#475569] leading-[30px]">Satış kararı vermeden önce iki yöntemi karşılaştırın.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={80}>
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── SSS ──────────────────────────────────────────────── */}
      <section id="sss" className={`py-[96px] ${testimonials && testimonials.length > 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="mb-14 text-center">
              <h2 className="text-[42px] font-bold text-[#0F172A] leading-[50px] mb-4">Sık Sorulan Sorular</h2>
              <p className="text-[18px] text-[#475569] leading-[30px]">Aklınızdaki soruları yanıtlayalım.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={80}>
            <div className="max-w-3xl mx-auto">
              <FaqSection faqs={faqs} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ALT CTA ──────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] py-[80px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image src="/12_blueprint_grid_dark.png" alt="" fill className="object-cover opacity-60" />
        </div>
        <div className="hidden lg:block absolute right-0 top-0 h-full pointer-events-none" aria-hidden="true">
          <Image src="/14_abkant_dark_overlay.png" alt="" width={400} height={400} className="h-full w-auto object-contain object-right" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up">
            <h2 className="text-[42px] font-bold text-white leading-[50px] mb-5 max-w-xl">
              Makinanızın Güncel Değerini Öğrenin.
            </h2>
            <p className="text-[18px] text-[#94A3B8] leading-[30px] mb-10 max-w-md">
              Ücretsiz formu tamamlayın. Teklifinizi görün, kararınızı daha sonra verin.
            </p>
            <Link href="/sat" className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] hover:-translate-y-0.5 text-white font-bold px-8 h-[56px] rounded-[16px] text-[16px] transition-all duration-200">
              Ücretsiz Teklif Al
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
