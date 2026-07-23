# Trink Makina — Proje Özeti (AI Bağlamı)

## Proje Nedir?

**Trink Makina** (trinkmakina.com), Türkiye'de sac işleme ikinci el makine alım platformudur.
Fabrika sahipleri makinelerini satmak için form doldurur → admin değerlendirir → e-posta/SMS ile teklif gönderir → müşteri kabul/red/karşı teklif yapar.

---

## Teknik Altyapı

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Veritabanı | Supabase (PostgreSQL) |
| Hosting | Vercel |
| E-posta | Resend |
| SMS | Harici entegrasyon |
| Stil | Tailwind CSS |
| Form | React Hook Form + Zod |
| Fotoğraf sıkıştırma | browser-image-compression |
| Admin bilgi kartı | html2canvas |

---

## Klasör / Rota Yapısı

```
app/
  (site)/
    page.tsx              → Ana sayfa (hero, avantajlar, nasıl çalışır, SSS)
    layout.tsx            → Header + Footer
    sat/page.tsx          → Makine satış formu (ana form)
    tesekkurler/page.tsx  → Form sonrası teşekkür sayfası
    kvkk/page.tsx
    kullanim-kosullari/page.tsx
    cerez-yonetimi/page.tsx
    ticari-ileti/page.tsx
  (auth)/                 → Giriş sayfaları
  (teklif)/               → Müşteriye gönderilen teklif linkleri
  (admin)/
    page.tsx              → Admin liste paneli
    [id]/page.tsx         → Talep detay + teklif gönderimi

api/
  listings/route.ts       → GET (liste) / POST (yeni başvuru)
  upload/route.ts         → Fotoğraf Supabase'e yükleme
  offer/[id]/route.ts     → Teklif gönderimi (mail + SMS paralel)

lib/
  supabase-server.ts      → Service role client
  supabase.ts             → Anon client
  email.ts                → Resend ile admin bildirimi + teklif maili
  types.ts                → Listing, MachineType, machineTypeLabels
  districts.ts            → 81 il → ilçe eşlemesi (Record<string, string[]>)

components/
  PhotoUpload.tsx          → Drag & drop fotoğraf yükleme (max 6)
  CityDistrictSelect.tsx   → Aranabilir il combobox + ilçe dropdown
```

---

## Veritabanı: `listings` Tablosu

```sql
id               uuid (PK)
machine_type     text   -- 'abkant' | 'giyotin' | 'press' | 'silindir' | 'boru-bukum' | 'testere' | 'diger'
brand            text
model            text
year             int
capacity         text   -- makineden türetilir (örn. "100 ton / 3000 mm")
condition        text   -- 'calisiyor' | 'bakim-gerekli' | 'arizali'
sell_reason      text
location_city    text
location_district text
contact_name     text
contact_phone    text
contact_email    text
photos           text[] -- Supabase Storage URL'leri
extra_fields     jsonb  -- Makineye özgü teknik alanlar (tip, tonaj, uzunluk...)
notes            text   -- Kullanıcının serbest açıklaması
status           text   -- 'pending' | 'offered' | 'accepted' | 'rejected'
offer_price      numeric
offer_token      text   -- Teklif kabul/red linki için unique token
created_at       timestamptz
```

### `extra_fields` Örnekleri (JSONB)

```json
// Abkant için
{ "tip": "CNC", "uzunluk": "3000-3100", "tonaj": "100-135", "eksen_sayisi": "4" }

// Giyotin için
{ "tip": "NC", "uzunluk": "3000", "kapasite_mm": "6" }

// Silindir için
{ "ust_top_capi": "220", "uzunluk": "2000", "max_kalinlik": "12", "calisma_sekli": "Hidrolik" }

// Boru büküm için
{ "mil_capi": "50", "tipi": "Mafsallı", "calisma_sekli": "Hidrolik" }

// Testere için
{ "mengene_acikligi": "300", "makine_surucu": "Sürücü Var", "aci_ayari": "Açı Ayarı Var" }
```

---

## Makine Türleri

| Değer | Etiket | Markalar (dropdown) |
|-------|--------|-------------------|
| abkant | Abkant Pres | Baykal, Dener, Durmazlar, Ermaksan, Diğer |
| giyotin | Giyotin Makas | Baykal, Dener, Durmazlar, Ermaksan, Diğer |
| silindir | Silindir Makineleri | Akyapak, Isıtan, Mac Bending, Şahinler, Diğer |
| press | Pres Makineleri | Serbest metin |
| boru-bukum | Boru Büküm Makineleri | Serbest metin |
| testere | Testereler | Serbest metin |
| diger | Diğer | Serbest metin |

**Not:** Abkant'ta marka "Diğer" seçilirse "Eksen Sayısı" alanı ek olarak açılır (1–6+).

---

## Form Akışı (`/sat`)

1. **Makine Bilgileri**
   - Makine türü → türe göre teknik detay alanları açılır
   - Marka (türe göre dropdown veya serbest metin)
   - Model (isteğe bağlı)
   - Üretim yılı
   - Satış gerekçesi
   - Çalışma durumu (Çalışıyor / Bakım Gerekli / Arızalı)
   - Makine hakkında detaylar (serbest metin → `notes` olarak kaydedilir)

2. **Fotoğraflar** — Max 6 adet, JPG/PNG, max 10MB (browser'da sıkıştırılır)

3. **Konum ve İletişim**
   - İl: Aranabilir combobox (Türkçe karakter duyarlı)
   - İlçe: İl seçilince o ilin ilçeleri dropdown olarak gelir
   - Ad Soyad, Cep Telefonu, E-posta

4. **KVKK + Kullanım Koşulları onayı**

Form gönderilince:
- Supabase'e kayıt eklenir
- Admin'e otomatik bildirim maili gönderilir

---

## Admin Paneli

- **Liste:** Tüm başvurular, duruma göre renkli etiket
- **Detay (`/admin/[id]`):**
  - Makine bilgileri kartı (html2canvas ile PNG olarak indirilebilir)
  - Fotoğraf galerisi (tek tek veya toplu indirme)
  - Teknik Detaylar (extra_fields içeriği Türkçe etiketlerle)
  - Müşteri notu
  - Teklif fiyatı girme
  - "Mail & SMS ile Gönder" butonu (paralel gönderim)

---

## Teklif Akışı

1. Admin fiyat girer → "Mail & SMS ile Gönder"
2. `Promise.allSettled` ile mail ve SMS aynı anda gönderilir
3. Müşteriye kişisel link gider (token bazlı)
4. Müşteri: Kabul / Red / Karşı Teklif
5. Admin panelde yanıt görünür

---

## Yapılmış Teknik İyileştirmeler

- HSTS güvenlik header'ı (`next.config.js`)
- Schema markup, sitemap, robots.txt, OG tags
- Core Web Vitals optimizasyonu
- Error boundaries
- Footer kontrast iyileştirmesi
- Zod form validasyon: `mode: 'onBlur'`, tüm hata mesajları Türkçe
- Türkçe karakter duyarlı il arama (`toLocaleLowerCase('tr')`)
- brand-blue (#2C3E50) Tailwind custom renk

---

## Eksik / Bekleyen İşler

- [ ] Gerçek şirket adresi (şu an örnek adres var)
- [ ] Google Search Console doğrulama kodu
- [ ] Google Analytics / GA4
- [ ] Sosyal medya hesapları (Instagram, LinkedIn)
- [ ] Gerçek OG görseli (1200×630px)
- [ ] Blog / içerik sayfaları
- [ ] Google Business Profile
- [ ] WhatsApp Business (form sonrası otomatik mesaj)
- [ ] Gerçek müşteri referansları

---

## Marka / Ton

- Site adı: **Trink Makina** (Varmak Makine bünyesinde)
- Domain: trinkmakina.com
- Ana renk: `#E67E22` (turuncu)
- İkincil renk: `#2C3E50` (koyu lacivert)
- Ana mesaj: *"Makinenizi bugün satın, nakit ödemenizi hemen alın"*
- Hedef kitle: 40-60 yaş, küçük-orta ölçekli metal fabrikası sahipleri

---

*Bu dosya ChatGPT veya başka bir AI asistana proje bağlamı aktarmak için hazırlanmıştır.*
