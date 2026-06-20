-- Faz 2: Otomatik teklif & müşteri yanıt sistemi
-- Supabase SQL Editor'da çalıştırın

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS offer_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS offer_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS customer_response TEXT CHECK (customer_response IN ('kabul', 'red', 'karsi-teklif')),
  ADD COLUMN IF NOT EXISTS customer_note TEXT,
  ADD COLUMN IF NOT EXISTS counter_offer_price INTEGER;

-- status alanının yeni değeri kabul etmesi için constraint güncelle (varsa)
-- Eğer status sütununda CHECK constraint varsa aşağıdakini de çalıştırın:
-- ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
-- ALTER TABLE listings ADD CONSTRAINT listings_status_check
--   CHECK (status IN ('bekliyor', 'teklif-verildi', 'yanit-bekliyor', 'kabul', 'red'));
