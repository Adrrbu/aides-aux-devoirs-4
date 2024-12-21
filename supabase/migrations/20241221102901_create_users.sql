-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    has_completed_onboarding BOOLEAN DEFAULT false,
    learning_difficulties TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{
        "theme": "light",
        "notifications": {
            "email": false,
            "push": true
        }
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT users_email_key UNIQUE (email)
);
