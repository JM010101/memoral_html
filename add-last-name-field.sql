-- Add Last Name field to memorials table
-- Run this in your Supabase SQL Editor

ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create an index for faster searching
CREATE INDEX IF NOT EXISTS memorials_last_name_idx ON memorials(last_name);

-- Optional: Extract last names from existing full names (you can run this or do it manually in admin)
-- UPDATE memorials 
-- SET last_name = TRIM(REGEXP_REPLACE(name, '^.* ', ''))
-- WHERE last_name IS NULL;
