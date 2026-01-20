-- Memorial Website Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sexoklyqxgvodfhjncbt/sql/new

-- Create memorials table
CREATE TABLE IF NOT EXISTS memorials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  tribute TEXT NOT NULL,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON memorials;
DROP POLICY IF EXISTS "Enable insert for all users" ON memorials;
DROP POLICY IF EXISTS "Enable update for all users" ON memorials;
DROP POLICY IF EXISTS "Enable delete for all users" ON memorials;

-- Create policies to allow anyone to read
CREATE POLICY "Enable read access for all users" ON memorials
  FOR SELECT
  USING (true);

-- Create policy to allow inserts
CREATE POLICY "Enable insert for all users" ON memorials
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow updates
CREATE POLICY "Enable update for all users" ON memorials
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow deletes
CREATE POLICY "Enable delete for all users" ON memorials
  FOR DELETE
  USING (true);

-- Create storage bucket for images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorial-images', 'memorial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;

-- Create storage policy for uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'memorial-images');

-- Create storage policy for reads
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'memorial-images');

-- Insert sample memorial (optional - remove if you don't want sample data)
INSERT INTO memorials (id, name, birth_date, death_date, tribute, photos)
VALUES (
  'sample-memorial',
  'Sample Memorial',
  '1950-01-01',
  '2023-12-31',
  'This is a sample memorial to test the system. You can delete this after adding your own memorials.',
  '[{"url": "https://via.placeholder.com/400x300", "alt": "Sample photo"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
