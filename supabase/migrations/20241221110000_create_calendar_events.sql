-- Create enum for event types
CREATE TYPE event_type AS ENUM ('task', 'course');

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    event_type event_type NOT NULL DEFAULT 'task',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON public.calendar_events(start_time);

-- Create function to get events for a date range
CREATE OR REPLACE FUNCTION get_user_events(
    p_user_id uuid,
    p_start_date timestamptz,
    p_end_date timestamptz
) RETURNS SETOF calendar_events AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM calendar_events
    WHERE user_id = p_user_id
    AND start_time >= p_start_date
    AND start_time < p_end_date
    ORDER BY start_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
