-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a stored procedure to handle user profile creation
CREATE OR REPLACE FUNCTION create_user_profile(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT
) RETURNS void AS $$
DECLARE
    _wallet_exists boolean;
    _stats_exists boolean;
BEGIN
    -- Start transaction
    BEGIN
        -- Create user profile
        INSERT INTO public.users (id, email, first_name, last_name, role)
        VALUES (p_user_id, p_email, p_first_name, p_last_name, 'student')
        ON CONFLICT (id) DO NOTHING;

        -- Check if wallet already exists
        SELECT EXISTS (
            SELECT 1 FROM public.wallets WHERE user_id = p_user_id FOR UPDATE
        ) INTO _wallet_exists;
        
        -- Create wallet if it doesn't exist
        IF NOT _wallet_exists THEN
            INSERT INTO public.wallets (user_id)
            VALUES (p_user_id);
        END IF;

        -- Check if statistics already exist
        SELECT EXISTS (
            SELECT 1 FROM public.user_statistics WHERE user_id = p_user_id FOR UPDATE
        ) INTO _stats_exists;
        
        -- Create statistics if they don't exist
        IF NOT _stats_exists THEN
            INSERT INTO public.user_statistics (user_id)
            VALUES (p_user_id);
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Log the error and re-raise
        RAISE LOG 'Error in create_user_profile for user_id: %. Error: %', p_user_id, SQLERRM;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
