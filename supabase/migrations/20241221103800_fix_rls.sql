-- Disable RLS on critical tables during user creation
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_statistics DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS users_insert_policy ON public.users;
DROP POLICY IF EXISTS wallets_insert_policy ON public.wallets;
DROP POLICY IF EXISTS user_statistics_insert_policy ON public.user_statistics;

-- Create new policies that allow the trigger function to work
CREATE POLICY users_insert_policy ON public.users
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY wallets_insert_policy ON public.wallets
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY user_statistics_insert_policy ON public.user_statistics
    FOR INSERT
    WITH CHECK (true);

-- Grant necessary permissions to the authenticated role
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.wallets TO authenticated;
GRANT INSERT ON public.user_statistics TO authenticated;
