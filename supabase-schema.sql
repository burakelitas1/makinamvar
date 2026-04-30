-- =============================================
-- Supabase SQL Editor'da çalıştırın
-- =============================================

-- Listings tablosu
CREATE TABLE IF NOT EXISTS listings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  machine_type  TEXT NOT NULL CHECK (machine_type IN ('abkant','giyotin','punta','lazer','diger')),
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INTEGER NOT NULL CHECK (year BETWEEN 1950 AND 2030),
  capacity      TEXT NOT NULL,
  condition     TEXT NOT NULL CHECK (condition IN ('calisiyor','arizali','bakim-gerekli')),
  location_city TEXT NOT NULL,
  location_district TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  photos        TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'bekliyor'
                CHECK (status IN ('bekliyor','teklif-verildi','kabul','red')),
  offer_price   NUMERIC(12,2),
  offer_sent_at TIMESTAMPTZ,
  notes         TEXT
);

-- RLS etkinleştir
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Herkes kayıt ekleyebilir (form gönderimi)
CREATE POLICY "anyone_can_insert" ON listings
  FOR INSERT TO anon WITH CHECK (true);

-- Sadece service_role okuyabilir/güncelleyebilir (admin API)
CREATE POLICY "service_role_all" ON listings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================
-- Storage bucket: listing-photos
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Herkes yükleyebilir (form fotoğrafları)
CREATE POLICY "anyone_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'listing-photos');

-- Herkes okuyabilir (public bucket)
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'listing-photos');
