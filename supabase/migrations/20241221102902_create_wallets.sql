-- Create wallets table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT wallets_user_id_key UNIQUE (user_id)
);

-- Create wallet_transactions enum type
CREATE TYPE transaction_type AS ENUM ('wallet', 'reward', 'purchase');

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    transaction_type transaction_type NOT NULL DEFAULT 'wallet',
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);

-- Create function to get or create wallet
CREATE OR REPLACE FUNCTION get_or_create_wallet(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    balance DECIMAL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
DECLARE
    v_wallet_id UUID;
BEGIN
    -- Try to get existing wallet
    SELECT id INTO v_wallet_id
    FROM wallets
    WHERE user_id = p_user_id;

    -- If no wallet exists, create one
    IF v_wallet_id IS NULL THEN
        INSERT INTO wallets (user_id)
        VALUES (p_user_id)
        RETURNING id INTO v_wallet_id;
    END IF;

    -- Return the wallet
    RETURN QUERY
    SELECT 
        w.id,
        w.balance,
        w.created_at,
        w.updated_at
    FROM wallets w
    WHERE w.id = v_wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add funds
CREATE OR REPLACE FUNCTION add_wallet_funds(
    p_wallet_id UUID,
    p_amount DECIMAL,
    p_description TEXT DEFAULT NULL,
    p_transaction_type transaction_type DEFAULT 'wallet'
) RETURNS BOOLEAN AS $$
BEGIN
    -- Update wallet balance
    UPDATE wallets
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = p_wallet_id;

    -- Create transaction record
    INSERT INTO wallet_transactions (
        wallet_id,
        amount,
        type,
        transaction_type,
        description
    ) VALUES (
        p_wallet_id,
        p_amount,
        CASE WHEN p_amount >= 0 THEN 'credit' ELSE 'debit' END,
        p_transaction_type,
        p_description
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own wallet"
    ON public.wallets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
    ON public.wallets FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
    ON public.wallet_transactions FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM wallets w
        WHERE w.id = wallet_transactions.wallet_id
        AND w.user_id = auth.uid()
    ));
