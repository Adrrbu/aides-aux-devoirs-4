-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage users"
    ON public.users
    FOR ALL
    TO service_role
    USING (true);

-- Enable RLS on wallets table
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Create policies for wallets table
CREATE POLICY "Users can view their own wallet"
    ON public.wallets
    FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage wallets"
    ON public.wallets
    FOR ALL
    TO service_role
    USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.wallets TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.wallets TO anon;
