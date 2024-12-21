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
        
        -- Drop our custom functions only
        DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
        DROP FUNCTION IF EXISTS update_user_statistics() CASCADE;
        DROP FUNCTION IF EXISTS update_user_statistics_on_exercise() CASCADE;
        DROP FUNCTION IF EXISTS check_subscription() CASCADE;
        DROP FUNCTION IF EXISTS get_user_profile() CASCADE;
        DROP FUNCTION IF EXISTS update_wallet() CASCADE;
    END IF;
END $$;
