-- First, disable RLS on all tables
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reward_history DISABLE ROW LEVEL SECURITY;

-- Drop all existing tables and custom functions in the public schema
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop tables
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop our custom functions only
    DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
    DROP FUNCTION IF EXISTS update_user_statistics() CASCADE;
    DROP FUNCTION IF EXISTS update_user_statistics_on_exercise() CASCADE;
    DROP FUNCTION IF EXISTS check_subscription() CASCADE;
    DROP FUNCTION IF EXISTS get_user_profile() CASCADE;
    DROP FUNCTION IF EXISTS update_wallet() CASCADE;

    -- Drop all types in public schema
    FOR r IN (
        SELECT typname 
        FROM pg_type 
        WHERE typnamespace = 'public'::regnamespace 
        AND typtype = 'c'
    ) LOOP
        BEGIN
            EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop type %', r.typname;
        END;
    END LOOP;
END $$;

-- Recreate the schema (this will be handled by subsequent migrations)