-- Create reward_history table
CREATE TABLE public.reward_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reward_history_updated_at
    BEFORE UPDATE ON public.reward_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.reward_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own rewards"
    ON public.reward_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards"
    ON public.reward_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX reward_history_user_id_idx ON public.reward_history(user_id);
CREATE INDEX reward_history_created_at_idx ON public.reward_history(created_at);

-- Grant permissions
GRANT ALL ON public.reward_history TO authenticated;
GRANT SELECT ON public.reward_history TO anon;
