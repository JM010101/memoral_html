-- Add email verification fields to memorials table
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP WITH TIME ZONE;

-- Update the status check constraint to include 'pending_verification' if it exists
-- Note: This assumes memorials table might have a status constraint
-- If it doesn't exist, this will fail gracefully
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'memorials_status_check'
    ) THEN
        ALTER TABLE memorials DROP CONSTRAINT memorials_status_check;
        ALTER TABLE memorials 
        ADD CONSTRAINT memorials_status_check 
        CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Create index for faster verification lookups
CREATE INDEX IF NOT EXISTS memorials_verification_token_idx ON memorials(verification_token) WHERE verification_token IS NOT NULL;

-- Add comments explaining the fields
COMMENT ON COLUMN memorials.verification_token IS 'Unique token for email verification';
COMMENT ON COLUMN memorials.email_verified IS 'Whether the submitter has verified their email';
COMMENT ON COLUMN memorials.status IS 'Status flow: pending_verification -> pending -> approved/rejected';
