-- COMPLETE DATABASE UPDATE SCRIPT
-- Run this ENTIRE script in your Supabase SQL Editor to fix the 500 error

-- 1. Add last_name column
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS last_name TEXT;

CREATE INDEX IF NOT EXISTS memorials_last_name_idx ON memorials(last_name);

-- 2. Add year columns (replacing old date columns)
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS death_year INTEGER;

CREATE INDEX IF NOT EXISTS memorials_birth_year_idx ON memorials(birth_year);
CREATE INDEX IF NOT EXISTS memorials_death_year_idx ON memorials(death_year);

-- 3. Grade 12 year (if not already added)
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS grade_12_year INTEGER;

CREATE INDEX IF NOT EXISTS memorials_grade_12_year_idx ON memorials(grade_12_year);

-- 4. Migrate existing data (if you have old data with birth_date/death_date)
UPDATE memorials 
SET birth_year = EXTRACT(YEAR FROM birth_date::date)
WHERE birth_date IS NOT NULL AND birth_year IS NULL;

UPDATE memorials 
SET death_year = EXTRACT(YEAR FROM death_date::date)
WHERE death_date IS NOT NULL AND death_year IS NULL;

-- 5. Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'memorials'
ORDER BY ordinal_position;

-- You should see: id, name, last_name, birth_year, death_year, grade_12_year, tribute, photos, created_at
