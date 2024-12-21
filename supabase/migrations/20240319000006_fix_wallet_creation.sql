-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function to handle new user creation and wallet initialization
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insert into users table
    INSERT INTO public.users (
        id,
        email,
        first_name,
        last_name,
        role,
        has_completed_onboarding,
        learning_difficulties,
        preferences,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'student',
        false,
        '{}',
        '{
            "theme": "light",
            "notifications": {
                "email": false,
                "push": true
            }
        }'::jsonb,
        NOW(),
        NOW()
    )
    RETURNING id INTO new_user_id;

    -- Create wallet for the new user
    INSERT INTO public.wallets (
        user_id,
        balance,
        created_at
    ) VALUES (
        new_user_id,
        0,
        NOW()
    );

    -- Create initial reward history entry
    INSERT INTO public.reward_history (
        user_id,
        amount,
        description,
        created_at
    ) VALUES (
        new_user_id,
        0,
        'Initial balance',
        NOW()
    );

    RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
