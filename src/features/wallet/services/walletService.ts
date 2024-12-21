import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export const getWalletBalance = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_or_create_wallet', {
        p_user_id: userId
      });

    if (error) {
      console.error('Error getting wallet:', error);
      toast.error('Erreur lors du chargement du portefeuille');
      return 0;
    }

    return data[0]?.balance || 0;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    toast.error('Erreur lors du chargement du portefeuille');
    return 0;
  }
};

export const addFunds = async (userId: string, amount: number) => {
  try {
    // First get or create the wallet
    const { data: wallet, error: walletError } = await supabase
      .rpc('get_or_create_wallet', {
        p_user_id: userId
      });

    if (walletError) {
      console.error('Error getting wallet:', walletError);
      throw new Error('Erreur lors de la récupération du portefeuille');
    }

    if (!wallet || wallet.length === 0) {
      throw new Error('Portefeuille non trouvé');
    }

    // Add funds using the RPC function
    const { error: fundError } = await supabase
      .rpc('add_wallet_funds', {
        p_wallet_id: wallet[0].id,
        p_amount: amount,
        p_description: 'Rechargement par parent',
        p_transaction_type: 'wallet'
      });

    if (fundError) {
      console.error('Error adding funds:', fundError);
      throw new Error('Erreur lors du rechargement du portefeuille');
    }

    return true;
  } catch (error: any) {
    console.error('Error adding funds:', error);
    toast.error(error.message || 'Erreur lors du rechargement du portefeuille');
    throw error;
  }
};

export const getTransactions = async (userId: string) => {
  try {
    // First get or create the wallet
    const { data: wallet, error: walletError } = await supabase
      .rpc('get_or_create_wallet', {
        p_user_id: userId
      });

    if (walletError) {
      console.error('Error getting wallet:', walletError);
      return [];
    }

    if (!wallet || wallet.length === 0) {
      return [];
    }

    const { data: transactions, error: transactionError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet[0].id)
      .order('created_at', { ascending: false });

    if (transactionError) {
      console.error('Error getting transactions:', transactionError);
      return [];
    }

    return transactions || [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};