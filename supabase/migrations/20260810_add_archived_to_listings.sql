ALTER TABLE listings ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS listings_archived_idx ON listings(archived);
