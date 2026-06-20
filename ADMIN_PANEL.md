# Trink Makina — Admin Panel Dokümantasyonu

## Giriş

Admin paneline `/admin` URL'inden ulaşılır. Parola ile korumalı tek kullanıcı sistemidir.

---

## Bölümler

### 1. Talepler (Başvuru Yönetimi)

Siteden gelen makine satış başvurularının listelendiği ve yönetildiği bölüm.

**Durum Akışı:**
```
Bekliyor → Teklif Gönderildi → Kabul Edildi
                              → Reddedildi
```

**Tablo Sütunları:**
- Tarih (oluşturma tarihi)
- Makine Türü
- Marka
- Konum
- İletişim (telefon/e-posta)
- Durum
- Detay linki

**Detay Sayfasında:**
- Fotoğraf galerisi (çoklu fotoğraf carousel)
- Makine bilgileri: tür, marka, model, yıl, kapasite, durum, konum
- İletişim bilgileri
- Durum güncelleme butonları
- Teklif formu (fiyat + notlar)

---

### 2. Referanslar (Müşteri Yorumları)

Ana sayfada dönen müşteri yorumlarını yönetir.

**Alanlar:**

| Alan | Açıklama | Örnek |
|------|----------|-------|
| `name` | Müşteri adı | Mehmet K. |
| `detail` | Satış detayı (lokasyon + makine) | Dudullu OSB \| 2018 Model Abkant Pres Sattı |
| `date` | Görüntülenecek tarih | 12.03.2026 |
| `text` | Yorum metni | ... |
| `active` | Aktif/pasif toggle | ✓ / ✗ |

**Notlar:**
- Pasif yapılanlar sitede görünmez
- Avatar olarak ismin baş harfi kullanılır
- `detail` alanı yeşil renkte gösterilir (müşteri kartında)

---

### 3. SSS (Sık Sorulan Sorular)

Ana sayfadaki SSS bölümünü yönetir.

**Alanlar:**

| Alan | Açıklama |
|------|----------|
| `question` | Soru metni |
| `answer` | Cevap metni |
| `active` | Aktif/pasif toggle |
| `order_num` | Sıralama numarası (küçük = önce) |

**Notlar:**
- Pasif yapılanlar sitede görünmez
- `order_num` ile sıralama ayarlanır

---

### 4. Site Ayarları

Siteyi kod değişikliği gerektirmeden güncellenebilir içerikler.

#### İletişim Bilgileri

| Alan | Açıklama | Mevcut Değer |
|------|----------|--------------|
| `phone` | Telefon numarası | 0850 123 45 67 |
| `email` | E-posta | info@trinkmakina.com |
| `address` | Adres | Örnek Mah. Sanayi Cad. No:1, Ataşehir / İstanbul |
| `working_hours` | Çalışma saatleri | Hafta içi 10:00 – 17:00 |

#### Hero Bölümü

| Alan | Açıklama | Mevcut Değer |
|------|----------|--------------|
| `hero_badge` | Hero'daki rozet yazısı | (badge text) |
| `hero_title` | Hero başlığı | Makina satmanın en TRİNK hali! |

#### CTA Banner

| Alan | Açıklama |
|------|----------|
| `cta_banner_title` | Banner başlığı |
| `cta_banner_subtitle` | Banner alt yazısı |

---

## Mevcut Sorunlar / Güncellenmesi Gereken Yerler

### Kod Değişikliği Gerektiren (bana söyle, ben güncelleyeyim):

1. **Login sayfası altyazısı**: Hâlâ "SaçMakine Yönetim Paneli" yazıyor → "Trink Makina Yönetim Paneli" olmalı
2. **Admin layout logo**: `/logo-icon.svg` placeholder kullanıyor → gerçek ikon SVG eklenmeli
3. **JSON-LD telefon**: `+908501234567` placeholder → gerçek numara girilmeli
4. **JSON-LD adres**: `Örnek Mah. Sanayi Cad. No:1` placeholder → gerçek adres girilmeli
5. **Google verification**: `metadata.verification.google` boş → Search Console doğrulama kodu girilmeli

---

## Planlama Alanı

> Aşağıya değiştirmek/eklemek istediklerini yaz, sonra bana ilet — hepsini tek seferde uygularım.

### Değiştirilecekler:

- [ ] ...

### Eklenecekler:

- [ ] ...

### Kaldırılacaklar:

- [ ] ...
