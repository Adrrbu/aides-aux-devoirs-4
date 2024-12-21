-- Drop and recreate the subscriptions table with proper constraints
DROP TABLE IF EXISTS public.subscriptions;

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    plan_id text NOT NULL,
    status text NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create RPC function for incrementing usage stats
CREATE OR REPLACE FUNCTION increment_usage_stat(
    p_user_id uuid,
    p_stat_type text
) RETURNS void AS $$
BEGIN
    INSERT INTO public.usage_stats (user_id, updated_at)
    VALUES (p_user_id, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
        aiquestions = CASE
            WHEN p_stat_type = 'aiquestions' THEN usage_stats.aiquestions + 1
            ELSE usage_stats.aiquestions
        END,
        exercisesperday = CASE
            WHEN p_stat_type = 'exercisesperday' THEN usage_stats.exercisesperday + 1
            ELSE usage_stats.exercisesperday
        END,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create usage_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.usage_stats (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    aiquestions integer DEFAULT 0,
    exercisesperday integer DEFAULT 0,
    last_reset timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create function to create initial subscription
CREATE OR REPLACE FUNCTION create_initial_subscription(
    p_user_id uuid
) RETURNS void AS $$
BEGIN
    INSERT INTO public.subscriptions (
        user_id,
        plan_id,
        status,
        current_period_end,
        cancel_at_period_end
    )
    VALUES (
        p_user_id,
        'DECOUVERTE',
        'active',
        '9999-12-31 23:59:59+00'::timestamptz,
        false
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Also create usage stats
    INSERT INTO public.usage_stats (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC to safely get or create subscription
CREATE OR REPLACE FUNCTION get_or_create_subscription(
    p_user_id uuid
) RETURNS json AS $$
DECLARE
    subscription_record public.subscriptions;
BEGIN
    -- Try to get existing subscription
    SELECT *
    INTO subscription_record
    FROM public.subscriptions
    WHERE user_id = p_user_id;

    -- If no subscription exists, create one
    IF subscription_record IS NULL THEN
        PERFORM create_initial_subscription(p_user_id);
        
        -- Get the newly created subscription
        SELECT *
        INTO subscription_record
        FROM public.subscriptions
        WHERE user_id = p_user_id;
    END IF;

    -- Return the subscription as JSON
    RETURN row_to_json(subscription_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
