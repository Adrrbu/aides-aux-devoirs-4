-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.exercise_attempts CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;

-- Create exercises table
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.subject_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    difficulty_level TEXT NOT NULL,
    best_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise attempts table
CREATE TABLE public.exercise_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT exercise_attempts_user_exercise_key UNIQUE (user_id, exercise_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX idx_exercises_subject_id ON public.exercises(subject_id);
CREATE INDEX idx_exercises_topic_id ON public.exercises(topic_id);
CREATE INDEX idx_exercise_attempts_user_id ON public.exercise_attempts(user_id);
CREATE INDEX idx_exercise_attempts_exercise_id ON public.exercise_attempts(exercise_id);

-- Create function to get user exercises with subject and topic names
CREATE OR REPLACE FUNCTION get_user_exercises(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    content JSONB,
    difficulty_level TEXT,
    best_score INTEGER,
    created_at TIMESTAMPTZ,
    subject_name TEXT,
    topic_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.content,
        e.difficulty_level,
        e.best_score,
        e.created_at,
        s.name as subject_name,
        st.name as topic_name
    FROM exercises e
    LEFT JOIN subjects s ON e.subject_id = s.id
    LEFT JOIN subject_topics st ON e.topic_id = st.id
    WHERE e.user_id = p_user_id
    ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own exercises"
    ON public.exercises FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercises"
    ON public.exercises FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises"
    ON public.exercises FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises"
    ON public.exercises FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts"
    ON public.exercise_attempts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
    ON public.exercise_attempts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts"
    ON public.exercise_attempts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attempts"
    ON public.exercise_attempts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
