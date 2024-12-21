-- Disable RLS temporarily
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subject topics table
CREATE TABLE IF NOT EXISTS subject_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, name)
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
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

-- Create exercise attempts table
CREATE TABLE IF NOT EXISTS exercise_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
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

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
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

-- Create exam content table
CREATE TABLE IF NOT EXISTS exam_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    course_content TEXT,
    revision_content TEXT,
    quiz_content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('wallet', 'store', 'reward')),
    gift_card_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO subjects (name) VALUES
    ('Mathématiques'),
    ('Français'),
    ('Histoire-Géographie'),
    ('Sciences'),
    ('Anglais')
ON CONFLICT (name) DO NOTHING;

-- Insert default topics for each subject
DO $$
DECLARE
    math_id UUID;
    french_id UUID;
    history_id UUID;
    science_id UUID;
    english_id UUID;
BEGIN
    -- Get subject IDs
    SELECT id INTO math_id FROM subjects WHERE name = 'Mathématiques';
    SELECT id INTO french_id FROM subjects WHERE name = 'Français';
    SELECT id INTO history_id FROM subjects WHERE name = 'Histoire-Géographie';
    SELECT id INTO science_id FROM subjects WHERE name = 'Sciences';
    SELECT id INTO english_id FROM subjects WHERE name = 'Anglais';

    -- Insert topics for Mathematics
    INSERT INTO subject_topics (subject_id, name) VALUES
        (math_id, 'Calcul'),
        (math_id, 'Géométrie'),
        (math_id, 'Algèbre'),
        (math_id, 'Probabilités')
    ON CONFLICT DO NOTHING;

    -- Insert topics for French
    INSERT INTO subject_topics (subject_id, name) VALUES
        (french_id, 'Grammaire'),
        (french_id, 'Conjugaison'),
        (french_id, 'Orthographe'),
        (french_id, 'Littérature')
    ON CONFLICT DO NOTHING;

    -- Insert topics for History-Geography
    INSERT INTO subject_topics (subject_id, name) VALUES
        (history_id, 'Histoire ancienne'),
        (history_id, 'Histoire moderne'),
        (history_id, 'Géographie physique'),
        (history_id, 'Géographie humaine')
    ON CONFLICT DO NOTHING;

    -- Insert topics for Science
    INSERT INTO subject_topics (subject_id, name) VALUES
        (science_id, 'Physique'),
        (science_id, 'Chimie'),
        (science_id, 'SVT'),
        (science_id, 'Technologie')
    ON CONFLICT DO NOTHING;

    -- Insert topics for English
    INSERT INTO subject_topics (subject_id, name) VALUES
        (english_id, 'Grammaire'),
        (english_id, 'Vocabulaire'),
        (english_id, 'Expression orale'),
        (english_id, 'Compréhension')
    ON CONFLICT DO NOTHING;
END $$;

-- Create RLS policies
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view subjects" ON subjects FOR SELECT TO PUBLIC USING (true);

ALTER TABLE subject_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view topics" ON subject_topics FOR SELECT TO PUBLIC USING (true);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON exercise_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create attempts" ON exercise_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exams" ON exams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exams" ON exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exams" ON exams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exams" ON exams FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE exam_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exam content" ON exam_content FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM exams WHERE exams.id = exam_content.exam_id AND exams.user_id = auth.uid()
    )
);
CREATE POLICY "Users can create exam content" ON exam_content FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM exams WHERE exams.id = exam_content.exam_id AND exams.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update own exam content" ON exam_content FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM exams WHERE exams.id = exam_content.exam_id AND exams.user_id = auth.uid()
    )
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON wallet_transactions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM wallets WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid()
    )
);

-- Create indexes
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