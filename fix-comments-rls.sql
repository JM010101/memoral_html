-- Fix Comments RLS Policy

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Allow public to insert comments" ON comments;
DROP POLICY IF EXISTS "Allow public read access to approved comments" ON comments;
DROP POLICY IF EXISTS "Allow service role to manage all comments" ON comments;

-- Make sure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT comments (status will default to pending)
CREATE POLICY "Allow anyone to insert comments"
    ON comments FOR INSERT
    TO anon, authenticated, public
    WITH CHECK (true);

-- Allow anyone to read APPROVED comments
CREATE POLICY "Allow public read approved comments"
    ON comments FOR SELECT
    TO anon, authenticated, public
    USING (status = 'approved');

-- Allow service role to do everything (for admin panel)
CREATE POLICY "Service role full access to comments"
    ON comments FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
