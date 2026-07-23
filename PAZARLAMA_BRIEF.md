# Trink Makina — Pazarlama Brief

## Proje Özeti

**Trink Makina** (trinkmakina.com), Türkiye'nin sac işleme ikinci el makine alım platformudur.
Fabrikaların atıl duran makinelerini değerlendirmek isteyen işletme sahiplerinden form yoluyla başvuru alır,
admin panelinden değerlendirip fiyat teklifi gönderir ve satın alım işlemini gerçekleştirir.

---

## Ürün / Platform

### Ne Yapıyor?
- Makine sahibi **trinkmakina.com/sat** adresinden form doldurur (marka, model, yıl, durum, fotoğraf, iletişim)
- Sistem otomatik olarak admin ekibine bildirim gönderir (e-posta)
- Admin, makineyi değerlendirip fiyat belirler ve **"Mail & SMS ile Gönder"** butonuyla müşteriye teklif iletir
- Müşteri aldığı e-postadaki kişisel linke tıklar: teklifi kabul eder, reddeder veya karşı teklif verir
- Admin panelde yanıt görünür, süreç tamamlanır

### Makine Türleri
- Abkant Pres
- Giyotin Makas
- Pres Makineleri
- Silindir Makineleri
- Boru Büküm Makineleri
- Testereler
- Diğer sac işleme makineleri

### Teknik Altyapı
- Next.js 14 (App Router) + Supabase + Vercel
- Resend (e-posta) + SMS entegrasyonu
- Admin paneli: Talepler, Durum yönetimi, Teklif gönderimi, Fotoğraf galerisi
- Mobil uyumlu, hızlı yüklenen site (Core Web Vitals optimize edildi)

---

## Hedef Kitle

### Birincil: Makine Satan Taraf
- **Kim:** Küçük-orta ölçekli metal/sac işleme fabrikaları, atölyeler
- **Nerede:** Türkiye geneli (özellikle sanayi kentleri: İstanbul, Bursa, İzmir, Ankara, Konya, Gaziantep, Kocaeli, Adana)
- **Profil:** 40-60 yaş arası fabrika sahibi veya üretim müdürü
- **Motivasyonu:**
  - Yeni makine aldı, eskisi atıl duruyor
  - İş yeri kapanıyor veya taşınıyor
  - Nakit ihtiyacı var, makineyi çabuk nakde çevirmek istiyor
  - Makineyle tek tek alıcı aramak istemiyor
- **Ağrı noktaları:**
  - "Satayım" diyorum ama alıcı bulamıyorum
  - İkinci el fiyatını bilmiyorum, kandırılacağım korkusu
  - Söküm, nakliye derdi
  - Zaman kaybı: ilan ver, müzakere et, kapanmaz

### İkincil: Makine Alan Taraf (gelecekte)
- Metal sektöründe makine arayan KOBİ'ler
- Şu an platform sadece satın alma yapıyor, ileride satış da açılabilir

---

## Değer Önerisi (USP)

| Özellik | Rakip | Trink Makina |
|---------|-------|--------------|
| Hız | Haftalarca bekle | **24 saat içinde teklif** |
| Söküm & nakliye | Müşteri öder | **Tamamen ücretsiz** |
| Ödeme | Vade, senet | **Aynı gün peşin** |
| Zahmet | İlanlar, pazarlık | **Sadece formu doldur** |
| Güven | Bilinmeyen alıcılar | **Kurumsal platform** |

**Ana mesaj:** *"Makinenizi bugün satın, nakit ödemenizi hemen alın"*

---

## Mevcut İçerik & Sayfa Yapısı

```
trinkmakina.com/          → Ana sayfa (hero, avantajlar, nasıl çalışır, referanslar, SSS)
trinkmakina.com/sat       → Başvuru formu (makine bilgileri + fotoğraf + iletişim)
trinkmakina.com/tesekkurler → Form sonrası teşekkür
trinkmakina.com/kvkk      → KVKK
trinkmakina.com/kullanim-kosullari
trinkmakina.com/cerez-yonetimi
trinkmakina.com/ticari-ileti
```

---

## Rakip Ortam

- **Sahibinden.com / Letgo** — genel ilanlar, kurumsal değil, alıcı bulmak zor
- **Maksan, Baykal bayileri** — yeni makine satıyor, ikinci eli çok almıyor
- **Yerel hurdacılar / komisyoncular** — güvensiz, düşük fiyat, nakliye müşteriye ait
- **LinkedIn/endüstri grupları** — ağa bağımlı, yavaş

**Boşluk:** Türkiye'de sac işleme makinelerine odaklı, hızlı, kurumsal, dijital alım platformu yok.

---

## Pazarlama Kanalları (Öneri)

### 1. Google Ads — Arama (En Öncelikli)
**Hedef anahtar kelimeler:**
- "ikinci el abkant pres satmak"
- "giyotin makas satmak istiyorum"
- "ikinci el sac makinesi alım"
- "fabrika makinesi satmak"
- "atıl makine değerlendirme"
- "abkant pres fiyatı [şehir]"

**Kampanya yapısı:**
- Makine türüne göre ayrı ad grupları (abkant, giyotin, silindir...)
- Şehir bazlı hedefleme (Bursa, İzmir, Konya...)
- Landing page: doğrudan /sat formuna yönlendirme

### 2. Google Display & YouTube
- Fabrika sahiplerine görsel reklam
- "Makineniz atıl mı duruyor?" mesajıyla remarketing

### 3. LinkedIn Ads
- Hedef: Üretim müdürü, fabrika sahibi, satın alma direktörü
- Sektör: Metal işleme, imalat, otomotiv yan sanayi
- İçerik: Vaka çalışması, "X firmamız Y TL aldı" hikayeleri

### 4. SEO (Organik)
**Öncelikli sayfalar oluşturulabilir:**
- "Abkant Pres Satmak İstiyorum" → /sat/abkant
- "Giyotin Makas İkinci El Fiyatları" → blog/giyotin-makas-fiyat
- Şehir bazlı sayfalar: "İstanbul ikinci el abkant pres satmak"

**Mevcut teknik SEO durumu:** ✅ Schema markup, sitemap, robots.txt, OG tags, hız optimizasyonu tamamlandı

### 5. Sanayi Siteleri & Forumlar
- Makine sektörü B2B portalları (makinaturk.com, sanayinet.com vb.)
- Metal sektörü Facebook grupları
- WhatsApp sanayi grupları

### 6. Saha Satışı & Ortaklık
- Abkant/giyotin bayileri ile anlaşma (yeni makine satarken eskiyi bize alsınlar)
- Muhasebeciler, fabrika danışmanları referans sistemi
- Kapanacak fabrikalar için tasfiye ortaklığı

---

## İçerik Pazarlama Fikirleri

1. **"Makinemi Kaça Satabilirim?"** hesap makinesi / blog
2. **Müşteri hikayeleri** — "Baykal abkantımı 3 günde sattım, 450.000 TL aldım"
3. **Makine rehberleri** — "Abkant Pres Nedir, İkinci El Değerini Ne Belirler?"
4. **Video içerik** — Söküm, taşıma süreci, müşteri röportajı
5. **E-posta nurturing** — Form doldurup teklifi kabul etmeyenlere yeniden temas

---

## KPI'lar (Başarı Metrikleri)

| Metrik | Hedef |
|--------|-------|
| Aylık form başvurusu | 50+ |
| Form → Teklif oranı | %80 |
| Teklif → Kabul oranı | %30 |
| Ortalama işlem süresi | 3-5 gün |
| Organik trafik (6. ay) | 500+ ziyaret/ay |
| Google Ads CPA | < 500 TL/başvuru |

---

## Marka Sesi & Ton

- **Güven veren, kurumsal ama sıcak** — "Fabrikacıyı anlayan birisi"
- **Net ve hızlı** — Uzun açıklamalar yok, aksiyon odaklı
- **Rakamlarla konuşan** — "24 saat", "aynı gün peşin", "%98 memnuniyet"
- **Teknik bilgili** — Makine jargonunu bilen, muhatap olunabilir

---

## Şu An Eksik / Yapılacaklar

- [ ] Gerçek müşteri referansları (isim + firma + miktar)
- [ ] Google Search Console bağlantısı
- [ ] Google Analytics / GA4 kurulumu
- [ ] Sosyal medya hesapları (Instagram, LinkedIn)
- [ ] Gerçek OG görseli (1200×630px marka tasarımı)
- [ ] Şirket adresi schema'ya eklenmesi
- [ ] Blog / içerik sayfaları
- [ ] Google Business Profile kaydı
- [ ] WhatsApp Business entegrasyonu (form sonrası otomatik mesaj)

---

*Bu doküman Claude'a proje bağlamı sağlamak için hazırlanmıştır.*
*Site: trinkmakina.com | Admin: trinkmakina.com/admin*
