-- Add fields for public memorial submissions and approval workflow
-- Run this in your Supabase SQL Editor

-- Add status field (pending, approved, rejected)
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS submitter_name TEXT,
ADD COLUMN IF NOT EXISTS submitter_email TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster filtering by status
CREATE INDEX IF NOT EXISTS memorials_status_idx ON memorials(status);
CREATE INDEX IF NOT EXISTS memorials_payment_status_idx ON memorials(payment_status);

-- Add check constraint for valid statuses
ALTER TABLE memorials 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE memorials 
ADD CONSTRAINT valid_payment_status CHECK (payment_status IN ('unpaid', 'paid', 'bypassed'));

-- Update existing memorials to have 'approved' status
UPDATE memorials 
SET status = 'approved', payment_status = 'bypassed'
WHERE status IS NULL;

-- Verify columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'memorials'
AND column_name IN ('status', 'submitter_name', 'submitter_email', 'payment_status', 'payment_id', 'submission_date')
ORDER BY ordinal_position;
