-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.users (id, email, first_name, last_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', 'student')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create wallet
    INSERT INTO public.wallets (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create statistics record
    INSERT INTO public.user_statistics (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
