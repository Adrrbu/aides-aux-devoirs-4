-- Create user statistics table
CREATE TABLE public.user_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_study_time INTEGER DEFAULT 0, -- in minutes
    total_exercises_completed INTEGER DEFAULT 0,
    correct_exercises INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_statistics_user_id_key UNIQUE (user_id)
);
