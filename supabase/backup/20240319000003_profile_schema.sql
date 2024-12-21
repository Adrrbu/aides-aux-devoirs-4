-- Disable RLS temporarily
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Add learning difficulties and preferences columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS learning_difficulties TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
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
}'::jsonb;

-- Create user statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_study_time INTEGER DEFAULT 0, -- in minutes
    completed_exercises INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_statistics_user_id_key UNIQUE (user_id)
);

-- Create study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    duration INTEGER NOT NULL, -- in minutes
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create schedule scans table
CREATE TABLE IF NOT EXISTS schedule_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    processed_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (processed_status IN ('pending', 'processing', 'completed', 'failed')),
    processed_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add parent PIN column to wallets table if it doesn't exist
ALTER TABLE wallets 
ADD COLUMN IF NOT EXISTS parent_pin TEXT;

-- Create function to update user statistics
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

-- Create triggers for statistics updates
DROP TRIGGER IF EXISTS update_stats_on_study_session ON study_sessions;
CREATE TRIGGER update_stats_on_study_session
    AFTER INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();

DROP TRIGGER IF EXISTS update_stats_on_exercise_attempt ON exercise_attempts;
CREATE TRIGGER update_stats_on_exercise_attempt
    AFTER INSERT ON exercise_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_statistics();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, points) VALUES
    ('Premier pas', 'Complétez votre premier exercice', '🎯', 10),
    ('Studieux', 'Étudiez pendant 1 heure', '📚', 20),
    ('Expert', 'Obtenez 100% à un exercice', '🏆', 30),
    ('Régulier', 'Connectez-vous 7 jours de suite', '🔥', 50)
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own statistics" ON user_statistics
    FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE schedule_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own schedule scans" ON schedule_scans
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_statistics_user_id_idx ON user_statistics(user_id);
CREATE INDEX IF NOT EXISTS study_sessions_user_id_idx ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS study_sessions_start_time_idx ON study_sessions(start_time);
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS schedule_scans_user_id_idx ON schedule_scans(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;