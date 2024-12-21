-- Create reward history table
CREATE TABLE public.reward_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID, -- Can be achievement_id, exercise_id, etc.
    reference_type TEXT, -- 'achievement', 'exercise', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);
