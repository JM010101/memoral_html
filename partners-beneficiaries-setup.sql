-- SQL Script to add Partners and Beneficiaries tables
-- Run this in your Supabase SQL Editor

-- Create Partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    impact_details TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Partners
-- Allow public read access
CREATE POLICY "Allow public read access to partners"
ON partners FOR SELECT
TO public
USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to partners"
ON partners FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for Beneficiaries
-- Allow public read access
CREATE POLICY "Allow public read access to beneficiaries"
ON beneficiaries FOR SELECT
TO public
USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to beneficiaries"
ON beneficiaries FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS partners_display_order_idx ON partners(display_order);
CREATE INDEX IF NOT EXISTS beneficiaries_display_order_idx ON beneficiaries(display_order);
