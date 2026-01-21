-- Supabase Database Setup for Fallen Gators Registry
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- MEMORIALS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS memorials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    birth_date DATE,
    death_date DATE,
    tribute TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_memorials_name ON memorials(name);
CREATE INDEX IF NOT EXISTS idx_memorials_created_at ON memorials(created_at DESC);

-- ====================================
-- COMMENTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY DEFAULT ('comment-' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT),
    memorial_id TEXT NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_memorial_id ON comments(memorial_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================

-- Enable RLS on both tables
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Memorials: Anyone can read
CREATE POLICY "Allow public read access to memorials"
    ON memorials FOR SELECT
    TO anon, authenticated
    USING (true);

-- Memorials: Only service role can insert/update/delete
CREATE POLICY "Allow service role to manage memorials"
    ON memorials FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Comments: Anyone can read approved comments
CREATE POLICY "Allow public read access to approved comments"
    ON comments FOR SELECT
    TO anon, authenticated
    USING (status = 'approved');

-- Comments: Anyone can insert comments (they start as pending)
CREATE POLICY "Allow public to insert comments"
    ON comments FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pending');

-- Comments: Only service role can update/delete/view all
CREATE POLICY "Allow service role to manage all comments"
    ON comments FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ====================================
-- STORAGE BUCKET FOR IMAGES
-- ====================================

-- Create storage bucket (run this in Supabase Dashboard > Storage)
-- Or use the API to create it

-- Note: After creating the bucket, set these policies in Storage:
-- 1. Allow public read access
-- 2. Allow service role to upload/delete

-- ====================================
-- FUNCTIONS
-- ====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for memorials
DROP TRIGGER IF EXISTS update_memorials_updated_at ON memorials;
CREATE TRIGGER update_memorials_updated_at
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- SAMPLE DATA (Optional - for testing)
-- ====================================

-- Uncomment to insert sample data
/*
INSERT INTO memorials (id, name, birth_date, death_date, tribute, photos)
VALUES (
    'sample-memorial',
    'John Doe',
    '1950-01-01',
    '2024-01-01',
    'A beloved member of our community who will be dearly missed.',
    '[]'::jsonb
);
*/

-- ====================================
-- VERIFICATION QUERIES
-- ====================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('memorials', 'comments');

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('memorials', 'comments');
