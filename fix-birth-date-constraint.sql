-- FIX: Remove NOT NULL constraints from old date columns
-- Run this in your Supabase SQL Editor

-- Option 1: Remove NOT NULL constraints (keeps old data)
ALTER TABLE memorials 
ALTER COLUMN birth_date DROP NOT NULL;

ALTER TABLE memorials 
ALTER COLUMN death_date DROP NOT NULL;

-- Now the old columns won't cause errors

-- Verify the constraints are gone
SELECT column_name, is_nullable, data_type
FROM information_schema.columns 
WHERE table_name = 'memorials'
ORDER BY ordinal_position;

-- You should see birth_date and death_date with is_nullable = 'YES'
