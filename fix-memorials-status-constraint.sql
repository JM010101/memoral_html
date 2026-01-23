-- Fix memorials status check constraint to allow 'pending_verification'
-- Run this SQL in your Supabase SQL Editor if you get a constraint error

-- Drop the existing constraint if it exists
ALTER TABLE memorials DROP CONSTRAINT IF EXISTS memorials_status_check;

-- Create new constraint with 'pending_verification' included
ALTER TABLE memorials 
ADD CONSTRAINT memorials_status_check 
CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));
