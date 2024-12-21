import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useWallet = () => {
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [parentBalance, setParentBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateBalanceFromTransactions = async (userId: string) => {
    try {
      // Récupérer le wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!wallet?.id) {
        // Créer un nouveau wallet si inexistant
        const { error: createError } = await supabase
          .from('wallets')
          .upsert([{
            user_id: userId,
            balance: 0,
            created_at: new Date().toISOString()
          }], {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (createError) throw createError;
        return { parentBalance: 0, earnedBalance: 0 };
      }

      // Récupérer toutes les transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: true });

      if (transactionError) throw transactionError;

      let currentParentBalance = 0;
      let currentEarnedBalance = 0;

      transactions?.forEach(transaction => {
        const amount = Number(transaction.amount);
        
        if (transaction.transaction_type === 'store') {
          // Pour les achats, on déduit d'abord du solde gagné
          if (currentEarnedBalance >= Math.abs(amount)) {
            currentEarnedBalance += amount; // amount est négatif ici
          } else {
            // Si le solde gagné ne suffit pas, on prend le reste sur le solde parent
            const remainingAmount = Math.abs(amount) - currentEarnedBalance;
            currentEarnedBalance = 0;
            currentParentBalance -= remainingAmount;
          }
        } else if (transaction.transaction_type === 'reward') {
          currentEarnedBalance += amount;
        } else {
          currentParentBalance += amount;
        }
      });

      return {
        parentBalance: Number(currentParentBalance.toFixed(2)),
        earnedBalance: Number(currentEarnedBalance.toFixed(2))
      };
    } catch (error) {
      console.error('Error calculating balance:', error);
      throw error;
    }
  };

  const loadWallet = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { parentBalance: newParentBalance, earnedBalance: newEarnedBalance } = 
        await calculateBalanceFromTransactions(user.id);

      setParentBalance(newParentBalance);
      setEarnedBalance(newEarnedBalance);
    } catch (error) {
      console.error('Error loading wallet:', error);
      toast.error('Erreur lors du chargement du portefeuille');
      setEarnedBalance(0);
      setParentBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();

    const walletChannel = supabase
      .channel('wallet_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions'
        },
        () => {
          loadWallet();
        }
      )
      .subscribe();

    return () => {
      walletChannel.unsubscribe();
    };
  }, []);

  const handlePurchase = async (cardId: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour effectuer un achat');
        return;
      }

      const totalBalance = earnedBalance + parentBalance;
      if (totalBalance < amount) {
        toast.error('Solde insuffisant');
        return;
      }

      // Récupérer l'ID du wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!wallet) throw new Error('Wallet not found');

      // Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert([{
          wallet_id: wallet.id,
          amount: -amount,
          type: 'debit',
          description: `Achat carte cadeau ${cardId}`,
          transaction_type: 'store',
          gift_card_id: cardId,
          created_at: new Date().toISOString()
        }]);

      if (transactionError) throw transactionError;

      // Recharger le solde
      await loadWallet();
      toast.success('Carte cadeau achetée avec succès');
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      toast.error('Erreur lors de l\'achat de la carte cadeau');
      await loadWallet();
    }
  };

  return {
    earnedBalance,
    parentBalance,
    loading,
    handlePurchase,
    refreshWallet: loadWallet
  };
};