-- Initial setup and cleanup
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all existing objects
DO $$ 
DECLARE
    _table_exists boolean;
BEGIN
    -- Check if any table exists first
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) INTO _table_exists;

    IF _table_exists THEN
        -- Drop triggers first
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP TRIGGER IF EXISTS update_stats_on_study_session ON study_sessions;
        DROP TRIGGER IF EXISTS update_stats_on_exercise_attempt ON exercise_attempts;
        
        -- Drop functions
        DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
        DROP FUNCTION IF EXISTS create_user_profile(uuid, text, text, text) CASCADE;
        DROP FUNCTION IF EXISTS update_user_statistics() CASCADE;
        
        -- Drop tables in correct order
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
    END IF;
END $$;
