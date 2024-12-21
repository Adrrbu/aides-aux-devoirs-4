-- Disable RLS temporarily
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Drop existing role constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role;

-- Add new role constraint
ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('student', 'parent'));

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;