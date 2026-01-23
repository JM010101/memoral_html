-- Add email verification fields to memorials table
ALTER TABLE memorials 
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP WITH TIME ZONE;

-- Update the status check constraint to include 'pending_verification'
-- Drop the existing constraint (it's called 'valid_status')
ALTER TABLE memorials DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE memorials DROP CONSTRAINT IF EXISTS memorials_status_check;

-- Create new constraint with 'pending_verification' included
ALTER TABLE memorials 
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));

-- Create index for faster verification lookups
CREATE INDEX IF NOT EXISTS memorials_verification_token_idx ON memorials(verification_token) WHERE verification_token IS NOT NULL;

-- Add comments explaining the fields
COMMENT ON COLUMN memorials.verification_token IS 'Unique token for email verification';
COMMENT ON COLUMN memorials.email_verified IS 'Whether the submitter has verified their email';
COMMENT ON COLUMN memorials.status IS 'Status flow: pending_verification -> pending -> approved/rejected';
