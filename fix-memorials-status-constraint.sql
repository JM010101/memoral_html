-- Fix memorials status check constraint to allow 'pending_verification'
-- Run this SQL in your Supabase SQL Editor if you get a constraint error

-- Drop the existing constraint (it's called 'valid_status')
ALTER TABLE memorials DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE memorials DROP CONSTRAINT IF EXISTS memorials_status_check;

-- Create new constraint with 'pending_verification' included
ALTER TABLE memorials 
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));
