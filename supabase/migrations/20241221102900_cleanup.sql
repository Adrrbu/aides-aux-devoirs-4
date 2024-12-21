-- Drop all existing objects
DO $$ 
DECLARE
    _table_exists boolean;
    rec record;
BEGIN
    -- Check if any table exists first
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
    ) INTO _table_exists;

    IF _table_exists THEN
        -- Drop triggers first
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP TRIGGER IF EXISTS update_stats_on_study_session ON study_sessions;
        DROP TRIGGER IF EXISTS update_stats_on_exercise_attempt ON exercise_attempts;
        
        -- Drop functions (excluding uuid-ossp functions)
        FOR rec IN 
            SELECT p.proname, p.pronamespace::regnamespace::name as nspname,
                   pg_catalog.pg_get_function_identity_arguments(p.oid) as args
            FROM pg_proc p
            WHERE p.pronamespace::regnamespace::name = 'public'
            AND p.proname NOT IN ('uuid_nil', 'uuid_generate_v1', 'uuid_generate_v1mc', 
                                'uuid_generate_v3', 'uuid_generate_v4', 'uuid_generate_v5')
        LOOP
            EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                         rec.nspname, rec.proname, rec.args);
        END LOOP;
        
        -- Drop all tables in correct order (respecting dependencies)
        DROP TABLE IF EXISTS user_achievements CASCADE;
        DROP TABLE IF EXISTS achievements CASCADE;
        DROP TABLE IF EXISTS schedule_scans CASCADE;
        DROP TABLE IF EXISTS study_sessions CASCADE;
        DROP TABLE IF EXISTS user_statistics CASCADE;
        DROP TABLE IF EXISTS wallet_transactions CASCADE;
        DROP TABLE IF EXISTS exam_content CASCADE;
        DROP TABLE IF EXISTS exams CASCADE;
        DROP TABLE IF EXISTS calendar_events CASCADE;
        DROP TABLE IF EXISTS exercise_attempts CASCADE;
        DROP TABLE IF EXISTS exercises CASCADE;
        DROP TABLE IF EXISTS subject_topics CASCADE;
        DROP TABLE IF EXISTS subjects CASCADE;
        DROP TABLE IF EXISTS wallets CASCADE;
        DROP TABLE IF EXISTS users CASCADE;

        -- Drop types
        DROP TYPE IF EXISTS transaction_type CASCADE;

        -- Drop policies
        FOR rec IN 
            SELECT *
            FROM pg_policies p
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
                         p.policyname, p.schemaname, p.tablename);
        END LOOP;
    END IF;
END $$;
