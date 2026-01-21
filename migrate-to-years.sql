-- Migrate from full dates to years only
-- Run this in your Supabase SQL Editor

-- Add new year columns
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS death_year INTEGER;

-- Extract years from existing dates (if you have data)
UPDATE memorials 
SET birth_year = EXTRACT(YEAR FROM birth_date::date)
WHERE birth_date IS NOT NULL AND birth_year IS NULL;

UPDATE memorials 
SET death_year = EXTRACT(YEAR FROM death_date::date)
WHERE death_date IS NOT NULL AND death_year IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS memorials_birth_year_idx ON memorials(birth_year);
CREATE INDEX IF NOT EXISTS memorials_death_year_idx ON memorials(death_year);

-- Optional: Drop old date columns after verifying data (uncomment if you want to remove them)
-- ALTER TABLE memorials DROP COLUMN IF EXISTS birth_date;
-- ALTER TABLE memorials DROP COLUMN IF EXISTS death_date;
