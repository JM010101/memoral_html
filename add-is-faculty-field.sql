-- Add is_faculty field to memorials table

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS is_faculty BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN memorials.is_faculty IS 'TRUE if person was faculty/staff, FALSE if student';

-- Create index for filtering
CREATE INDEX IF NOT EXISTS memorials_is_faculty_idx ON memorials(is_faculty);
