-- Disable RLS temporarily
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects in correct order
DO $$ 
DECLARE
    _table_exists boolean;
BEGIN
    -- Check if any table exists first
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'study_sessions'
    ) INTO _table_exists;

    -- Only proceed with drops if tables exist
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

-- Create base tables
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    has_completed_onboarding BOOLEAN DEFAULT false,
    learning_difficulties TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{
        "theme": "light",
        "notifications": {
            "email": false,
            "push": false
        },
        "calendar": {
            "defaultView": "week",
            "startHour": 8,
            "endHour": 18
        }
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT valid_role CHECK (role IN ('student', 'parent'))
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    parent_pin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT wallets_user_id_key UNIQUE (user_id)
);

-- Create subjects and topics tables
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subject_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, name)
);

-- Create learning content tables
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    topic_id UUID REFERENCES subject_topics(id),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    difficulty_level TEXT NOT NULL,
    best_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercise_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create calendar and exam tables
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('task', 'course', 'revision')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    color TEXT,
    attachment_url TEXT,
    exam_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    topic_id UUID REFERENCES subject_topics(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    priority INTEGER DEFAULT 1,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    course_content TEXT,
    revision_content TEXT,
    quiz_content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create statistics and achievements tables
CREATE TABLE user_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_study_time INTEGER DEFAULT 0,
    completed_exercises INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_statistics_user_id_key UNIQUE (user_id)
);

CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    duration INTEGER NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create wallet transactions table
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('wallet', 'store', 'reward')),
    gift_card_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create schedule scans table
CREATE TABLE schedule_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    processed_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (processed_status IN ('pending', 'processing', 'completed', 'failed')),
    processed_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (
        id,
        email,
        first_name,
        last_name,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_statistics
    SET 
        updated_at = NOW(),
        total_study_time = (
            SELECT COALESCE(SUM(duration), 0)
            FROM study_sessions
            WHERE user_id = NEW.user_id
        ),
        completed_exercises = (
            SELECT COUNT(*)
            FROM exercise_attempts
            WHERE user_id = NEW.user_id
        ),
        average_score = (
            SELECT COALESCE(AVG(score), 0)
            FROM exercise_attempts
            WHERE user_id = NEW.user_id
        )
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_stats_on_study_session
    AFTER INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();

CREATE TRIGGER update_stats_on_exercise_attempt
    AFTER INSERT ON exercise_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();

-- Insert default data
INSERT INTO subjects (name) VALUES
    ('Mathématiques'),
    ('Français'),
    ('Histoire-Géographie'),
    ('Sciences'),
    ('Anglais')
ON CONFLICT (name) DO NOTHING;

INSERT INTO achievements (name, description, icon, points) VALUES
    ('Premier pas', 'Complétez votre premier exercice', '🎯', 10),
    ('Studieux', 'Étudiez pendant 1 heure', '📚', 20),
    ('Expert', 'Obtenez 100% à un exercice', '🏆', 30),
    ('Régulier', 'Connectez-vous 7 jours de suite', '🔥', 50)
ON CONFLICT DO NOTHING;

-- Insert default topics for each subject
DO $$
DECLARE
    math_id UUID;
    french_id UUID;
    history_id UUID;
    science_id UUID;
    english_id UUID;
BEGIN
    SELECT id INTO math_id FROM subjects WHERE name = 'Mathématiques';
    SELECT id INTO french_id FROM subjects WHERE name = 'Français';
    SELECT id INTO history_id FROM subjects WHERE name = 'Histoire-Géographie';
    SELECT id INTO science_id FROM subjects WHERE name = 'Sciences';
    SELECT id INTO english_id FROM subjects WHERE name = 'Anglais';

    -- Insert topics for each subject
    INSERT INTO subject_topics (subject_id, name) VALUES
        (math_id, 'Calcul'),
        (math_id, 'Géométrie'),
        (math_id, 'Algèbre'),
        (math_id, 'Probabilités'),
        (french_id, 'Grammaire'),
        (french_id, 'Conjugaison'),
        (french_id, 'Orthographe'),
        (french_id, 'Littérature'),
        (history_id, 'Histoire ancienne'),
        (history_id, 'Histoire moderne'),
        (history_id, 'Géographie physique'),
        (history_id, 'Géographie humaine'),
        (science_id, 'Physique'),
        (science_id, 'Chimie'),
        (science_id, 'SVT'),
        (science_id, 'Technologie'),
        (english_id, 'Grammaire'),
        (english_id, 'Vocabulaire'),
        (english_id, 'Expression orale'),
        (english_id, 'Compréhension')
    ON CONFLICT DO NOTHING;
END $$;

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_scans ENABLE ROW LEVEL SECURITY;

-- Create all necessary RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view subjects" ON subjects FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Everyone can view topics" ON subject_topics FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts" ON exercise_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create attempts" ON exercise_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Create all necessary indexes
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_created_at_idx ON users(created_at);
CREATE INDEX wallets_user_id_idx ON wallets(user_id);
CREATE INDEX exercises_user_id_idx ON exercises(user_id);
CREATE INDEX exercises_subject_id_idx ON exercises(subject_id);
CREATE INDEX exercise_attempts_user_id_idx ON exercise_attempts(user_id);
CREATE INDEX exercise_attempts_exercise_id_idx ON exercise_attempts(exercise_id);
CREATE INDEX calendar_events_user_id_idx ON calendar_events(user_id);
CREATE INDEX calendar_events_start_time_idx ON calendar_events(start_time);
CREATE INDEX exams_user_id_idx ON exams(user_id);
CREATE INDEX exams_subject_id_idx ON exams(subject_id);
CREATE INDEX exam_content_exam_id_idx ON exam_content(exam_id);
CREATE INDEX wallet_transactions_wallet_id_idx ON wallet_transactions(wallet_id);
CREATE INDEX subject_topics_subject_id_idx ON subject_topics(subject_id);
CREATE INDEX user_statistics_user_id_idx ON user_statistics(user_id);
CREATE INDEX study_sessions_user_id_idx ON study_sessions(user_id);
CREATE INDEX study_sessions_start_time_idx ON study_sessions(start_time);
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX schedule_scans_user_id_idx ON schedule_scans(user_id);