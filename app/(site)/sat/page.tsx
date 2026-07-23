'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CITIES } from '@/lib/cities'
import PhotoUpload from '@/components/PhotoUpload'
import { CheckCircle2, Wrench, AlertCircle } from 'lucide-react'

const schema = z.object({
  machine_type: z.enum(['abkant', 'giyotin', 'press', 'silindir', 'boru-bukum', 'testere', 'diger'], {
    required_error: 'Makine türü seçiniz',
  }),
  abkant_tip: z.string().optional(),
  abkant_uzunluk: z.string().optional(),
  abkant_tonaj: z.string().optional(),
  giyotin_tip: z.string().optional(),
  giyotin_uzunluk: z.string().optional(),
  giyotin_kapasite: z.string().optional(),
  silindir_uzunluk: z.string().optional(),
  silindir_tip: z.string().optional(),
  silindir_max_kalinlik: z.string().optional(),
  silindir_calisma_sekli: z.string().optional(),
  boru_mil_capi: z.string().optional(),
  boru_tipi: z.string().optional(),
  boru_tipi_aciklama: z.string().optional(),
  boru_calisma_sekli: z.string().optional(),
  testere_mengene_acikligi: z.string().optional(),
  testere_makine_surucu: z.string().optional(),
  testere_aci_ayari: z.string().optional(),
  press_tip: z.string().optional(),
  diger_makine_turu: z.string().optional(),
  brand_select: z.string().optional(),
  brand_other: z.string().optional(),
  brand_free: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce
    .number({ invalid_type_error: 'Geçerli yıl giriniz' })
    .min(1950, 'En az 1950')
    .max(new Date().getFullYear(), 'Geçersiz yıl'),
  capacity: z.string().optional(),
  condition: z.enum(['calisiyor', 'arizali', 'bakim-gerekli'], {
    required_error: 'Çalışma durumu seçiniz',
  }),
  sell_reason: z.string().min(1, 'Lütfen satış nedeninizi seçiniz'),
  location_city: z.string().min(1, 'İl seçiniz'),
  location_district: z.string().min(2, 'İlçe giriniz').max(100),
  contact_name: z.string().min(2, 'Ad Soyad giriniz').max(100),
  contact_phone: z
    .string()
    .min(10, 'Geçerli telefon giriniz')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Geçerli telefon giriniz'),
  contact_email: z.string().email('Geçerli e-posta giriniz'),
  description: z.string().max(1000).optional(),
})

type FormData = z.infer<typeof schema>

export default function SatPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [kvkk, setKvkk] = useState(false)
  const [kullanim, setKullanim] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const machineType = watch('machine_type')
  const brandSelect = watch('brand_select')
  const isAbkant = machineType === 'abkant'
  const isGiyotin = machineType === 'giyotin'
  const isPress = machineType === 'press'
  const isSilindir = machineType === 'silindir'
  const isBoruBukum = machineType === 'boru-bukum'
  const isTestere = machineType === 'testere'
  const isDigerMakine = machineType === 'diger'
  const boruTipi = watch('boru_tipi')

  useEffect(() => {
    setValue('brand_select', '')
    setValue('brand_free', '')
    setValue('brand_other', '')
    setValue('capacity', '')
  }, [machineType, setValue])

  const brandOptions = isSilindir
    ? ['Akyapak', 'Isıtan', 'Mac Bending', 'Şahinler']
    : ['Baykal', 'Dener', 'Durmazlar', 'Ermaksan']
  const isOtherBrand = brandSelect === 'diger'

  async function uploadPhotos(files: File[]): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(`Fotoğraf yüklenemedi: ${j.error}`)
      }
      const { url } = await res.json()
      urls.push(url)
    }
    return urls
  }

  async function onSubmit(data: FormData) {
    if (photos.length === 0) {
      setError('En az 1 fotoğraf yüklemeniz gerekmektedir.')
      return
    }
    if (!kvkk || !kullanim) {
      setError('Devam etmek için onay kutucuklarını işaretlemeniz gerekmektedir.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const photoUrls = await uploadPhotos(photos)

      const extra_fields = isAbkant ? {
        tip: data.abkant_tip || null,
        uzunluk: data.abkant_uzunluk || null,
        tonaj: data.abkant_tonaj || null,
      } : isGiyotin ? {
        tip: data.giyotin_tip || null,
        uzunluk: data.giyotin_uzunluk || null,
        kapasite_mm: data.giyotin_kapasite || null,
      } : isSilindir ? {
        ust_top_capi: data.silindir_tip || null,
        uzunluk: data.silindir_uzunluk || null,
        max_kalinlik: data.silindir_max_kalinlik || null,
        calisma_sekli: data.silindir_calisma_sekli || null,
      } : isBoruBukum ? {
        mil_capi: data.boru_mil_capi || null,
        tipi: data.boru_tipi || null,
        tipi_aciklama: data.boru_tipi_aciklama || null,
        calisma_sekli: data.boru_calisma_sekli || null,
      } : isPress ? {
        tip: data.press_tip || null,
      } : null

      const needsCapacity = !isAbkant && !isGiyotin && !isSilindir && !isBoruBukum && !isTestere && !isDigerMakine
      if (needsCapacity && !data.capacity) {
        setError('Tonaj / Kapasite giriniz')
        setSubmitting(false)
        return
      }

      const resolvedBrand = (isPress || isBoruBukum || isTestere || isDigerMakine)
        ? (data.brand_free || '')
        : data.brand_select === 'diger' ? (data.brand_other || 'Diğer') : (data.brand_select || '')

      if (!resolvedBrand) {
        setError('Marka giriniz')
        setSubmitting(false)
        return
      }

      const { abkant_tip, abkant_uzunluk, abkant_tonaj, giyotin_tip, giyotin_uzunluk, giyotin_kapasite, silindir_uzunluk, silindir_tip, silindir_max_kalinlik, silindir_calisma_sekli, boru_mil_capi, boru_tipi, boru_tipi_aciklama, boru_calisma_sekli, testere_mengene_acikligi, testere_makine_surucu, testere_aci_ayari, press_tip, diger_makine_turu, brand_select, brand_other, brand_free, brand, model, ...rest } = data
      const resolvedModel = isPress ? '' : (model || '')

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, brand: resolvedBrand, model: resolvedModel, photos: photoUrls, extra_fields }),
      })

      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Bir hata oluştu')
      }

      router.push('/tesekkurler')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu, lütfen tekrar deneyin.')
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sayfa başlığı */}
      <div className="bg-[#0F172A] py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Ücretsiz Teklif Talebi</h1>
          <p className="text-[#94A3B8] text-sm sm:text-base">
            Makinenizin bilgilerini paylaşın. Uzman ekibimiz değerlendirsin, satın alma teklifinizi 24 saat içinde iletsin.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* İlerleme göstergesi */}
        <p className="text-center text-[13px] text-[#94A3B8] mb-4">Yaklaşık 3 dakika sürer.</p>
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Makine Bilgileri', 'Fotoğraflar', 'İletişim'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#3B5BDB] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <span className="text-xs font-medium text-gray-600 hidden sm:block">{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-300" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Makine Bilgileri */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#3B5BDB] text-white rounded-full text-xs font-bold flex items-center justify-center">1</span>
              Makine Bilgileri
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">Makine Türü *</label>
                <select className="select-field" {...register('machine_type')}>
                  <option value="">Seçiniz…</option>
                  <option value="abkant">Abkant Pres</option>
                  <option value="giyotin">Giyotin Makas</option>
                  <option value="press">Pres Makineleri</option>
                  <option value="silindir">Silindir Makineleri</option>
                  <option value="boru-bukum">Boru Büküm Makineleri</option>
                  <option value="testere">Testereler</option>
                  <option value="diger">Diğer</option>
                </select>
                {errors.machine_type && <p className="error-msg">{errors.machine_type.message}</p>}
              </div>

              {/* Diğer makine türü serbest metin */}
              {isDigerMakine && (
                <div>
                  <label className="label">Makine Türü (Açıklayınız) *</label>
                  <input
                    className="input-field"
                    placeholder="Makine türünü yazınız"
                    {...register('diger_makine_turu')}
                  />
                </div>
              )}

              {/* Abkant-specific sub-fields */}
              {isAbkant && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#3B5BDB] uppercase tracking-wide">Abkant Pres Detayları</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">Tipi</label>
                      <select className="select-field" {...register('abkant_tip')}>
                        <option value="">Seçiniz…</option>
                        <option value="NC">NC</option>
                        <option value="CNC">CNC</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Uzunluk (mm)</label>
                      <select className="select-field" {...register('abkant_uzunluk')}>
                        <option value="">Seçiniz…</option>
                        <option value="1250-1350">1250–1350</option>
                        <option value="1500-1600">1500–1600</option>
                        <option value="2000-2500">2000–2500</option>
                        <option value="3000-3100">3000–3100</option>
                        <option value="4000-4100">4000–4100</option>
                        <option value="6000-6100">6000–6100</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Tonaj (ton)</label>
                      <select className="select-field" {...register('abkant_tonaj')}>
                        <option value="">Seçiniz…</option>
                        <option value="35-60">35–60</option>
                        <option value="60-100">60–100</option>
                        <option value="100-135">100–135</option>
                        <option value="135-220">135–220</option>
                        <option value="220-320">220–320</option>
                        <option value="320-440">320–440</option>
                        <option value="440-600">440–600</option>
                        <option value="600+">600+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Giyotin-specific sub-fields */}
              {isGiyotin && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Giyotin Makas Detayları</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">Tipi</label>
                      <select className="select-field" {...register('giyotin_tip')}>
                        <option value="">Seçiniz…</option>
                        <option value="NC">NC</option>
                        <option value="CNC">CNC</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Uzunluk (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 3000"
                        {...register('giyotin_uzunluk')}
                      />
                    </div>
                    <div>
                      <label className="label">Büküm Kapasitesi (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 6"
                        {...register('giyotin_kapasite')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Silindir sub-fields */}
              {isSilindir && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Silindir Makinesi Detayları</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="label">Çalışma Şekli</label>
                      <select className="select-field" {...register('silindir_calisma_sekli')}>
                        <option value="">Seçiniz…</option>
                        <option value="Hidrolik">Hidrolik</option>
                        <option value="Redüktörlü">Redüktörlü</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">Üst Top Çapı (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 220"
                        {...register('silindir_tip')}
                      />
                    </div>
                    <div>
                      <label className="label">Uzunluk (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 2000"
                        {...register('silindir_uzunluk')}
                      />
                    </div>
                    <div>
                      <label className="label">Maks. Kalınlık (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 12"
                        {...register('silindir_max_kalinlik')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Boru Büküm sub-fields */}
              {isBoruBukum && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Boru Büküm Makinesi Detayları</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Çalışma Şekli</label>
                      <select className="select-field" {...register('boru_calisma_sekli')}>
                        <option value="">Seçiniz…</option>
                        <option value="Hidrolik">Hidrolik</option>
                        <option value="Redüktörlü">Redüktörlü</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Mil Çapı (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 50"
                        {...register('boru_mil_capi')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Tipi</label>
                    <select className="select-field" {...register('boru_tipi')}>
                      <option value="">Seçiniz…</option>
                      <option value="Mafsallı">Mafsallı</option>
                      <option value="Üç Toplu">Üç Toplu</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                  {boruTipi === 'diger' && (
                    <div>
                      <label className="label">Tipi Açıklama</label>
                      <input
                        className="input-field"
                        placeholder="Tip açıklamasını giriniz"
                        {...register('boru_tipi_aciklama')}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Testere sub-fields */}
              {isTestere && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Testere Detayları</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">Mengene Açıklığı (mm)</label>
                      <input
                        className="input-field"
                        placeholder="örn. 300"
                        {...register('testere_mengene_acikligi')}
                      />
                    </div>
                    <div>
                      <label className="label">Makine Sürücüsü</label>
                      <select className="select-field" {...register('testere_makine_surucu')}>
                        <option value="">Seçiniz…</option>
                        <option value="Sürücü Var">Sürücü Var</option>
                        <option value="Sürücü Yok">Sürücü Yok</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Açı Ayarı</label>
                      <select className="select-field" {...register('testere_aci_ayari')}>
                        <option value="">Seçiniz…</option>
                        <option value="Açı Ayarı Var">Açı Ayarı Var</option>
                        <option value="Açı Ayarı Yok">Açı Ayarı Yok</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Press sub-fields */}
              {isPress && (
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pres Makinesi Detayları</p>
                  <div>
                    <label className="label">Tipi</label>
                    <select className="select-field" {...register('press_tip')}>
                      <option value="">Seçiniz…</option>
                      <option value="Eksantrik">Eksantrik</option>
                      <option value="Hidrolik">Hidrolik</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="label">Marka *</label>
                {isPress || isBoruBukum || isTestere || isDigerMakine ? (
                  <input
                    className="input-field"
                    placeholder="Marka adını giriniz"
                    {...register('brand_free')}
                  />
                ) : (
                  <>
                    <select className="select-field" {...register('brand_select')}>
                      <option value="">Seçiniz…</option>
                      {brandOptions.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                      <option value="diger">Diğer</option>
                    </select>
                    {errors.brand_select && <p className="error-msg">{errors.brand_select.message}</p>}
                    {isOtherBrand && (
                      <div className="mt-2">
                        <label className="label">Marka Adı *</label>
                        <input
                          className="input-field"
                          placeholder="Marka adını giriniz"
                          {...register('brand_other', { required: isOtherBrand ? 'Marka adı giriniz' : false })}
                        />
                        {errors.brand_other && <p className="error-msg">{errors.brand_other.message}</p>}
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isAbkant && !isGiyotin && !isSilindir && !isBoruBukum && !isTestere && !isDigerMakine && (
                <div>
                  <label className="label">Tonaj / Kapasite *</label>
                  <input className="input-field" placeholder="örn. 100 ton" {...register('capacity')} />
                  {errors.capacity && <p className="error-msg">{errors.capacity.message}</p>}
                </div>
              )}

              <div>
                <label className="label">Üretim Yılı *</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="örn. 2015"
                  {...register('year')}
                />
                {errors.year && <p className="error-msg">{errors.year.message}</p>}
              </div>

              <div>
                <label className="label">Teklif Alma Nedeniniz *</label>
                <select className="select-field" {...register('sell_reason')}>
                  <option value="">Lütfen seçiniz…</option>
                  <option value="kapasite-artisi">Kapasite güncelleme — yeni makine tedarik edildi</option>
                  <option value="is-yeri-kapaniyor">İşletme kapanışı veya yer değişikliği</option>
                  <option value="model-degisikligi">Teknoloji veya model yenileme</option>
                  <option value="atil-kullanim">Kullanım dışı kalma — mevcut ihtiyaçlarla örtüşmüyor</option>
                  <option value="finansal-neden">Finansal planlama kapsamında değerlendirme</option>
                  <option value="diger">Diğer</option>
                </select>
                {errors.sell_reason && <p className="error-msg">{errors.sell_reason.message}</p>}
              </div>

              <div>
                <label className="label">Makinenin Çalışma Durumu *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'calisiyor',    label: 'Çalışıyor',    Icon: CheckCircle2 },
                    { val: 'bakim-gerekli', label: 'Bakım Gerekli', Icon: Wrench },
                    { val: 'arizali',      label: 'Arızalı',       Icon: AlertCircle },
                  ].map(({ val, label, Icon }) => (
                    <label key={val} className="cursor-pointer">
                      <input type="radio" value={val} {...register('condition')} className="peer hidden" />
                      <div className="border-2 border-[#E2E8F0] rounded-[16px] p-4 text-center peer-checked:border-[#3B5BDB] peer-checked:bg-[#3B5BDB]/5 hover:border-[#CBD5E1] transition-all duration-200">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-[#94A3B8]" strokeWidth={2} />
                        <div className="text-[13px] font-semibold text-[#0F172A]">{label}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.condition && <p className="error-msg">{errors.condition.message}</p>}
              </div>

              <div>
                <label className="label">Eklemek İstediğiniz Bilgiler <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Bakım geçmişi, yapılan revizyonlar, ekipman durumu veya teklifimizi etkileyebilecek diğer bilgileri paylaşabilirsiniz."
                  {...register('description')}
                />
              </div>
            </div>
          </div>

          {/* Fotoğraflar */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#3B5BDB] text-white rounded-full text-xs font-bold flex items-center justify-center">2</span>
              Fotoğraflar
              <span className="text-xs font-normal text-gray-400 ml-1">(max. 5 adet)</span>
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-[#2C3E50] mb-2">Daha Doğru Teklif İçin Fotoğraflar</p>
              <p className="text-xs text-gray-500 mb-3">Makinenizin farklı açılardan çekilmiş net fotoğrafları, değerlendirme sürecini hızlandırır ve teklif doğruluğunu artırır.</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Ön görünüm</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Sağ görünüm</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Sol görünüm</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Arka görünüm</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Kontrol paneli</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] flex-shrink-0" />Makine etiketi veya plakası</li>
              </ul>
            </div>
            <PhotoUpload onFilesChange={setPhotos} maxFiles={5} />
          </div>

          {/* Konum & İletişim */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#3B5BDB] text-white rounded-full text-xs font-bold flex items-center justify-center">3</span>
              Teklif İletişim Bilgileri
            </h2>

            <p className="text-[13px] text-[#475569] mb-5">Teklifinizi paylaşabilmemiz için iletişim bilgilerinizi girin.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">İl *</label>
                  <select className="select-field" {...register('location_city')}>
                    <option value="">İl seçiniz…</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.location_city && <p className="error-msg">{errors.location_city.message}</p>}
                </div>
                <div>
                  <label className="label">İlçe *</label>
                  <input className="input-field" placeholder="İlçe" {...register('location_district')} />
                  {errors.location_district && <p className="error-msg">{errors.location_district.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Ad Soyad *</label>
                <input className="input-field" placeholder="Ad Soyad" {...register('contact_name')} />
                {errors.contact_name && <p className="error-msg">{errors.contact_name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Cep Telefonu *</label>
                  <input className="input-field" placeholder="05XX XXX XX XX" type="tel" {...register('contact_phone')} />
                  <p className="text-[11px] text-[#94A3B8] mt-1">Sadece teklif süreciyle ilgili iletişim için kullanılacaktır.</p>
                  {errors.contact_phone && <p className="error-msg">{errors.contact_phone.message}</p>}
                </div>
                <div>
                  <label className="label">E-posta *</label>
                  <input className="input-field" placeholder="ornek@mail.com" type="email" {...register('contact_email')} />
                  <p className="text-[11px] text-[#94A3B8] mt-1">Teklif detayları SMS ve e-posta ile iletilecektir.</p>
                  {errors.contact_email && <p className="error-msg">{errors.contact_email.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* KVKK onay kutucukları */}
          <div className="space-y-3 px-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={kvkk}
                onChange={(e) => setKvkk(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-blue-600 flex-shrink-0 cursor-pointer"
              />
              <span className={`text-xs leading-relaxed ${kvkk ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="text-red-500 font-bold mr-0.5">*</span>
                <a href="/kvkk" target="_blank" className="text-[#3B5BDB] hover:underline font-medium">Kişisel Verilerin Korunması</a>{' '}
                metnini okudum ve kişisel verilerimin teklif süreci kapsamında işlenmesini kabul ediyorum.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={kullanim}
                onChange={(e) => setKullanim(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-blue-600 flex-shrink-0 cursor-pointer"
              />
              <span className={`text-xs leading-relaxed ${kullanim ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="text-red-500 font-bold mr-0.5">*</span>
                <a href="/kullanim-kosullari" target="_blank" className="text-[#3B5BDB] hover:underline font-medium">Kullanım Koşulları</a>'nı
                okudum ve kabul ediyorum.
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <p className="text-center text-[13px] text-[#475569]">
            Teklif almak taahhüt oluşturmaz. Karar tamamen size aittir.
          </p>

          <button type="submit" disabled={submitting} className="btn-primary w-full text-base py-4 rounded-xl">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Teklifiniz hazırlanıyor…
              </span>
            ) : (
              'Ücretsiz Teklif Al'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
