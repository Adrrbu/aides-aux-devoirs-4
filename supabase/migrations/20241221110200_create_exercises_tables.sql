-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create subject_topics table
CREATE TABLE IF NOT EXISTS public.subject_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(subject_id, name)
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    topic_id uuid REFERENCES public.subject_topics(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    content jsonb NOT NULL,
    difficulty_level text NOT NULL,
    best_score integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_subject_id ON public.exercises(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_topics_subject_id ON public.subject_topics(subject_id);

-- Create function to get user exercises with subject and topic names
CREATE OR REPLACE FUNCTION get_user_exercises(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    content jsonb,
    difficulty_level text,
    best_score integer,
    created_at timestamptz,
    subject_name text,
    topic_name text
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

-- Insert default subjects
INSERT INTO public.subjects (name, description)
VALUES 
    ('Mathématiques', 'Cours et exercices de mathématiques'),
    ('Français', 'Cours et exercices de français'),
    ('Histoire-Géographie', 'Cours et exercices d''histoire et de géographie'),
    ('Sciences', 'Cours et exercices de sciences')
ON CONFLICT (name) DO NOTHING;
