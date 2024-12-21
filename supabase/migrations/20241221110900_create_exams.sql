-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_exams_user_id ON public.exams(user_id);
CREATE INDEX idx_exams_due_date ON public.exams(due_date);

-- Create function to get user exams
CREATE OR REPLACE FUNCTION get_user_exams(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    subject TEXT,
    description TEXT,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.subject,
        e.description,
        e.due_date,
        e.created_at
    FROM exams e
    WHERE e.user_id = p_user_id
    ORDER BY e.due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own exams"
    ON public.exams FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exams"
    ON public.exams FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exams"
    ON public.exams FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exams"
    ON public.exams FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
