# Trink Makina — Proje Özeti

## Proje
- **Site:** trinkmakina.com (Next.js 14 App Router, Supabase, Vercel)
- **Repo:** burakelitas1/makinamvar
- **Branch:** main (geliştirme branch: claude/confident-dirac-ilppea)

## Teknoloji
- Next.js 14 App Router
- Supabase (veritabanı + storage)
- Tailwind CSS
- Vercel (deploy)

## Önemli Kurallar
- **FORM'A DOKUNMA:** `app/(site)/sat/page.tsx` — form yapısı, alan sırası, validasyon, step sırası, API/DB mapping'e kesinlikle dokunma. Değişiklik gerekirse kullanıcıyı uyar.
- Mevcut tasarım dilini, renkleri, tipografiyi koru.
- Yeni framework/kütüphane ekleme.

## Yapı
```
app/
  (site)/          # Public site
    page.tsx       # Ana sayfa
    layout.tsx     # Navbar + footer (adres: Doğanlar Mh. 1419 Sk. No:34 Bornova/İZMİR)
    sat/page.tsx   # Teklif formu (DOKUNMA)
    blog/          # Bilgi Bankası (/blog URL'i korunuyor)
  admin/           # Admin paneli
    talepler/      # Talep listesi (arşivle/sil özelliği var)
    blog/          # Blog yönetimi
    [id]/          # Talep detay
  api/
    admin/listings/[id]/route.ts  # PATCH (arşivle) + DELETE
    upload/route.ts               # Görsel yükleme
    admin/posts/route.ts          # Blog CRUD
lib/
  types.ts         # Listing, MachineType, ListingStatus tipleri
  supabase-server.ts
  auth.ts          # verifyAdminToken(token: string)
public/            # WebP formatında görseller (optimize edilmiş)
```

## Veritabanı (Supabase)
- **listings** tablosu: talep formları, `archived` boolean kolonu var
- **posts** tablosu: blog yazıları, `published`, `cover_image`, `slug`
- **faqs**, **testimonials**, **settings** tabloları
- Storage bucket: `listing-photos` (public_read)

## Önemli Detaylar
- Admin auth: cookie tabanlı JWT, `verifyAdminToken(token: string)` — NextRequest değil string alır
- Blog sayfası "Bilgi Bankası" olarak yeniden adlandırıldı (/blog URL'i SEO için korunuyor)
- Görseller WebP formatına dönüştürüldü, `unoptimized: true` kaldırıldı
- Favicon: `app/favicon.ico` + `public/favicon.ico` (logo'dan türetildi)
- Logo: `public/trinkmakina_logo.png` (optimize edilmiş, ~51KB)
- Telefon: 0850 123 45 67 (placeholder — gerçek numara henüz girilmedi)
- İstatistik tabanı: BASE_TOTAL=340, BASE_SOLD=127 (page.tsx ~107. satır)

## Son Durum (Ağustos 2026)
- v1.0.0 release alındı
- PageSpeed mobil: 86 → iyileştirme yapıldı (WebP + optimizasyon)
- Arşivleme/silme özelliği eklendi
- Blog yazıları mevcut (Supabase'de)
- Otomatik blog yazısı için Anthropic API key gerekiyor (henüz eklenmedi)
