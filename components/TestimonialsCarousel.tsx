'use client'

import { useEffect, useState, useRef } from 'react'

type Testimonial = { name: string; detail: string; date: string; text: string }

const FALLBACK: Testimonial[] = [
  {
    name: 'Mehmet K.',
    detail: 'Dudullu OSB | 2018 Model Abkant Pres Sattı',
    date: '12.03.2026',
    text: 'Açıkçası başta tereddüt ettim, "ya gelmezlerse, ya fiyatı düşürürlerse" diye. Ama söyledikleri gibi oldu. Makineyi söktüler, götürdüler, parasını da o gün yatırdılar. Başka türlü satmayı düşünemem artık.',
  },
  {
    name: 'Ahmet Y.',
    detail: 'Bursa Nilüfer OSB | 2016 Model Giyotin Makas Sattı',
    date: '28.02.2026',
    text: 'İki yıldır köşede duruyordu makine, ne yapacağımı bilemedim. Bir arkadaş "dene" dedi, denedim. 3 günde bitti her şey. Üstelik nakliyeyi de kendileri ayarladı, benden tek kuruş almadılar.',
  },
  {
    name: 'Selin D.',
    detail: 'İzmir Çiğli | 2020 Model Fiber Lazer 1000W Sattı',
    date: '15.01.2026',
    text: 'Dürüst olmak gerekirse beklentim yoktu pek. Ama fotoğrafları yükledim, birkaç saat sonra aradılar, tekliflerini söylediler. Pazarlık bile yapmadım çünkü gerçekten makuldü. Tavsiye ederim.',
  },
  {
    name: 'Kadir T.',
    detail: 'Kocaeli Gebze | 2015 Model Punta Kaynak Sattı',
    date: '05.03.2026',
    text: 'En çok söküm meselesinden korkuyordum, vinç tutmak, işçi bulmak vs. Hepsini kendileri halletti. Ben sadece kapıyı açtım, makine gitti, para geldi. Bu kadar basit.',
  },
  {
    name: 'Hasan Ö.',
    detail: 'Ankara OSTİM | 2019 Model CNC Abkant Sattı',
    date: '18.02.2026',
    text: 'Gelen ekip işini biliyor, makineye baktılar, ne olduğunu anladılar, saçma bir fiyat söylemediler. Paranın yarısını hemen, kalanını da makine yüklenirken aldım. Güvendim, aldatılmadım.',
  },
  {
    name: 'Fatma Ş.',
    detail: 'İstanbul Esenyurt | 2017 Model Giyotin Makas Sattı',
    date: '22.01.2026',
    text: 'Eşim vefat edince işyerini kapatmak zorunda kaldım, makineleri ne yapacağımı bilemedim. Bu platform sayesinde çok rahat bir süreç geçirdim. Gerçekten işimi kolaylaştırdılar.',
  },
  {
    name: 'Erdal M.',
    detail: 'Gaziantep OSB | 2014 Model Lazer Kesim Sattı',
    date: '10.03.2026',
    text: 'Birkaç yere sormustum daha önce, ya gelmiyorlar ya saçma fiyat söylüyorlar. Burada farklıydı. Fotoğraflardan anlayıp makul konuştular. Pazarda bu fiyatı bulamazdım açıkçası.',
  },
  {
    name: 'Serkan B.',
    detail: 'Manisa OSB | 2021 Model Abkant Pres Sattı',
    date: '01.02.2026',
    text: 'Yeni makine aldım, eskisini ne yapacağımı düşünüyordum. Bir deneyeyim dedim, beklediğimden hızlı oldu. Hem iyi para aldım hem de depodan kurtuldum. İkisi bir arada olunca çok iyi.',
  },
  {
    name: 'Ali R.',
    detail: 'Konya OSB | 2016 Model Punta Kaynak Sattı',
    date: '14.01.2026',
    text: 'Sabah formu doldurdum, öğleden sonra aradılar. "Ne zaman uygun olursunuz?" dediler. Ertesi sabah geldiler, baktılar, anlaştık. Hız açısından gerçekten şaşırdım, bu kadarını beklemiyordum.',
  },
  {
    name: 'Murat G.',
    detail: 'Sakarya OSB | 2018 Model Fiber Lazer 2000W Sattı',
    date: '27.02.2026',
    text: 'Teknik adam geldi, makineyi düzgünce inceledi, saçmalık konuşmadı. Söküm sırasında da dikkatli davrandılar, etrafı dağıtmadılar. Temiz, düzgün bir iş çıkardılar. Teşekkürler.',
  },
]

export default function TestimonialsCarousel({ testimonials }: { testimonials?: Testimonial[] }) {
  const TESTIMONIALS = (testimonials && testimonials.length > 0) ? testimonials : FALLBACK
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const total = TESTIMONIALS.length
  const visibleCount = 3

  function next() {
    setCurrent((c) => (c + 1) % total)
  }

  function prev() {
    setCurrent((c) => (c - 1 + total) % total)
  }

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(next, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, current])

  function getVisible() {
    return Array.from({ length: visibleCount }, (_, i) => (current + i) % total)
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden">
        <div className="grid md:grid-cols-3 gap-5">
          {getVisible().map((idx) => {
            const t = TESTIMONIALS[idx]
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-[#27AE60] text-xs font-semibold leading-tight">{t.detail}</p>
                    </div>
                  </div>
                  <span className="text-gray-200 text-4xl font-serif leading-none flex-shrink-0">"</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{t.text}</p>
                <p className="text-gray-400 text-xs">{t.date}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-gray-300 hover:border-[#E67E22] hover:text-[#E67E22] flex items-center justify-center transition-colors text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-[#E67E22]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full border border-gray-300 hover:border-[#E67E22] hover:text-[#E67E22] flex items-center justify-center transition-colors text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
