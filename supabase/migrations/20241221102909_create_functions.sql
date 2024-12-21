-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _wallet_exists boolean;
    _stats_exists boolean;
    _user_exists boolean;
BEGIN
    -- Log the start of the function and input
    RAISE LOG 'handle_new_user() started for user_id: %, email: %', NEW.id, NEW.email;

    -- Start transaction
    BEGIN
        -- Check if user already exists
        SELECT EXISTS (
            SELECT 1 FROM public.users WHERE id = NEW.id
        ) INTO _user_exists;
        
        RAISE LOG 'User exists check: %', _user_exists;

        -- Check if wallet already exists
        SELECT EXISTS (
            SELECT 1 FROM public.wallets WHERE user_id = NEW.id
        ) INTO _wallet_exists;
        
        RAISE LOG 'Wallet exists check: %', _wallet_exists;

        -- Check if statistics already exists
        SELECT EXISTS (
            SELECT 1 FROM public.user_statistics WHERE user_id = NEW.id
        ) INTO _stats_exists;
        
        RAISE LOG 'Statistics exists check: %', _stats_exists;

        -- Only create user if they don't exist
        IF NOT _user_exists THEN
            RAISE LOG 'Creating user profile for user_id: %', NEW.id;
            INSERT INTO public.users (id, email, first_name, last_name, role)
            VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', 'student');
        END IF;
        
        -- Only create wallet if it doesn't exist
        IF NOT _wallet_exists THEN
            RAISE LOG 'Creating wallet for user_id: %', NEW.id;
            INSERT INTO public.wallets (user_id)
            VALUES (NEW.id);
        ELSE
            RAISE LOG 'Wallet already exists for user_id: %, skipping creation', NEW.id;
        END IF;
        
        -- Only create statistics if they don't exist
        IF NOT _stats_exists THEN
            RAISE LOG 'Creating statistics for user_id: %', NEW.id;
            INSERT INTO public.user_statistics (user_id)
            VALUES (NEW.id);
        END IF;

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create function to update user statistics
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total study time and last activity date
    IF TG_TABLE_NAME = 'study_sessions' THEN
        UPDATE public.user_statistics
        SET 
            total_study_time = total_study_time + NEW.duration,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    
    -- Update exercise statistics and last activity date
    ELSIF TG_TABLE_NAME = 'exercise_attempts' THEN
        UPDATE public.user_statistics
        SET 
            total_exercises_completed = total_exercises_completed + 1,
            correct_exercises = correct_exercises + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updating statistics
CREATE TRIGGER update_stats_on_study_session
    AFTER INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();

CREATE TRIGGER update_stats_on_exercise_attempt
    AFTER INSERT ON exercise_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();
