-- Add email verification fields to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP WITH TIME ZONE;

-- Update the status check constraint to include 'pending_verification'
-- First, drop the existing constraint if it exists
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_status_check;

-- Create new constraint with 'pending_verification' included
ALTER TABLE comments 
ADD CONSTRAINT comments_status_check 
CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));

-- Create index for faster verification lookups
CREATE INDEX IF NOT EXISTS comments_verification_token_idx ON comments(verification_token) WHERE verification_token IS NOT NULL;

-- Add comments explaining the fields
COMMENT ON COLUMN comments.verification_token IS 'Unique token for email verification';
COMMENT ON COLUMN comments.email_verified IS 'Whether the commenter has verified their email';
COMMENT ON COLUMN comments.status IS 'Status flow: pending_verification -> pending -> approved/rejected';
