-- First, drop the uuid-ossp extension (we'll recreate it later)
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

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

    -- Drop all functions in public schema
    FOR r IN (
        SELECT proname, oid 
        FROM pg_proc 
        WHERE pronamespace = 'public'::regnamespace
    ) LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || 
                    pg_get_function_identity_arguments(r.oid) || ') CASCADE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop function %', r.proname;
        END;
    END LOOP;

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

-- Recreate the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recreate the schema (this will be handled by subsequent migrations)