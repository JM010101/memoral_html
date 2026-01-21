-- Add Grade 12 Graduating Year field to memorials table
-- Run this in your Supabase SQL Editor

ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS grade_12_year INTEGER;

-- Create an index for faster searching
CREATE INDEX IF NOT EXISTS memorials_grade_12_year_idx ON memorials(grade_12_year);

-- Update existing records (optional - you can set these manually in admin panel later)
-- UPDATE memorials SET grade_12_year = 2020 WHERE id = 'some-id';
