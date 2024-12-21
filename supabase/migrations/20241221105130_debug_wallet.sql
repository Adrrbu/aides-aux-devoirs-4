-- Drop and recreate the trigger to ensure clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a more defensive trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _wallet_exists boolean;
    _stats_exists boolean;
    _user_exists boolean;
BEGIN
    -- Log the start of the function and input
    RAISE LOG 'handle_new_user() started for user_id: %, email: %', NEW.id, NEW.email;

    -- Start transaction with serializable isolation
    BEGIN
        -- Lock the wallets table to prevent concurrent inserts
        LOCK TABLE public.wallets IN SHARE ROW EXCLUSIVE MODE;
        
        -- Check if wallet already exists
        SELECT EXISTS (
            SELECT 1 FROM public.wallets WHERE user_id = NEW.id FOR UPDATE
        ) INTO _wallet_exists;
        
        RAISE LOG 'Wallet exists check: %', _wallet_exists;

        -- Only create wallet if it doesn't exist
        IF NOT _wallet_exists THEN
            RAISE LOG 'Creating wallet for user_id: %', NEW.id;
            INSERT INTO public.wallets (user_id)
            VALUES (NEW.id);
        ELSE
            RAISE LOG 'Wallet already exists for user_id: %, skipping creation', NEW.id;
        END IF;

        -- Create user profile if it doesn't exist
        INSERT INTO public.users (id, email, first_name, last_name, role)
        VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', 'student')
        ON CONFLICT (id) DO NOTHING;

        -- Create user statistics if they don't exist
        INSERT INTO public.user_statistics (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;

        -- If we get here, commit the transaction
        RAISE LOG 'handle_new_user() completed successfully for user_id: %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
        -- Log the error
        RAISE LOG 'Error in handle_new_user() for user_id: %. Error: %', NEW.id, SQLERRM;
        RAISE;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation with explicit ordering
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Diagnostic queries
SELECT 
    t.tgname as trigger_name,
    n.nspname as schema_name,
    c.relname as table_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname IN ('auth', 'public')
AND t.tgname NOT LIKE 'pg_%'
ORDER BY n.nspname, c.relname, t.tgname;

-- Check for any existing wallets for the problematic user
SELECT * FROM public.wallets WHERE user_id = 'dd6856fd-7b3b-4189-954e-b5801ddb4126';

-- Check for any existing users
SELECT * FROM public.users WHERE id = 'dd6856fd-7b3b-4189-954e-b5801ddb4126';

-- Check for any existing statistics
SELECT * FROM public.user_statistics WHERE user_id = 'dd6856fd-7b3b-4189-954e-b5801ddb4126';
