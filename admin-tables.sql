-- Referanslar (Testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  detail TEXT,
  text TEXT NOT NULL,
  date TEXT,
  active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_testimonials" ON testimonials FOR ALL TO service_role USING (true);
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon USING (true);

-- SSS (FAQs)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_faqs" ON faqs FOR ALL TO service_role USING (true);
CREATE POLICY "anon_select_faqs" ON faqs FOR SELECT TO anon USING (true);

-- Site Ayarları
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all_settings" ON site_settings FOR ALL TO service_role USING (true);
CREATE POLICY "anon_select_settings" ON site_settings FOR SELECT TO anon USING (true);

-- Varsayılan ayarlar
INSERT INTO site_settings (key, value) VALUES
  ('phone', '0850 123 45 67'),
  ('email', 'info@makinamvar.com'),
  ('address', 'Örnek Mah. Sanayi Cad. No:1, Ataşehir / İstanbul'),
  ('working_hours', 'Hafta içi 10:00 – 17:00'),
  ('hero_title', 'Makinenizi bugün satın, nakit ödemenizi hemen alın'),
  ('hero_badge', 'Türkiye''nin İlk Sac İşleme Makineleri Alım Platformu'),
  ('cta_banner_title', 'Makineniz atıl mı duruyor?'),
  ('cta_banner_subtitle', 'Hemen formu doldurun, 24 saat içinde nakit teklifiniz gelsin.')
ON CONFLICT (key) DO NOTHING;
