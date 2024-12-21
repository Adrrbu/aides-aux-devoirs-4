import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export const getWalletBalance = async (userId: string) => {
  try {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    return wallet?.balance || 0;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return 0;
  }
};

export const addFunds = async (userId: string, amount: number) => {
  try {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id, balance')
      .eq('user_id', userId)
      .single();

    if (!wallet) throw new Error('Wallet not found');

    const { error: updateError } = await supabase
      .from('wallets')
      .update({ 
        balance: wallet.balance + amount
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    const { error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert([{
        wallet_id: wallet.id,
        amount: amount,
        type: 'credit',
        description: 'Rechargement par parent',
        transaction_type: 'wallet'
      }]);

    if (transactionError) throw transactionError;

    return true;
  } catch (error) {
    console.error('Error adding funds:', error);
    toast.error('Erreur lors du rechargement du portefeuille');
    throw error;
  }
};

export const getTransactions = async (userId: string) => {
  try {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!wallet) return [];

    const { data: transactions } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    return transactions || [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};