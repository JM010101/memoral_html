-- Fix comments status check constraint to allow 'pending_verification'
-- Run this SQL in your Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_status_check;

-- Create new constraint with 'pending_verification' included
ALTER TABLE comments 
ADD CONSTRAINT comments_status_check 
CHECK (status IN ('pending_verification', 'pending', 'approved', 'rejected'));
