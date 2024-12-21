-- Disable RLS temporarily
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Drop existing objects in correct order
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile(uuid, text, text, text) CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with role column
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    has_completed_onboarding BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT valid_role CHECK (role = 'user')
);

-- Create wallets table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT wallets_user_id_key UNIQUE (user_id)
);

-- Create function to safely create user profile
CREATE OR REPLACE FUNCTION create_user_profile(
    in_user_id UUID,
    in_user_email TEXT,
    in_user_first_name TEXT,
    in_user_last_name TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert user profile
    INSERT INTO users (
        id,
        email,
        first_name,
        last_name,
        role,
        has_completed_onboarding,
        created_at,
        updated_at
    ) VALUES (
        in_user_id,
        in_user_email,
        in_user_first_name,
        in_user_last_name,
        'user',
        false,
        NOW(),
        NOW()
    );

    -- Create wallet
    INSERT INTO wallets (
        user_id,
        balance,
        created_at
    ) VALUES (
        in_user_id,
        0,
        NOW()
    );
END;
$$;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own wallet"
    ON public.wallets FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX users_email_idx ON public.users (email);
CREATE INDEX users_created_at_idx ON public.users (created_at);
CREATE INDEX wallets_user_id_idx ON public.wallets (user_id);