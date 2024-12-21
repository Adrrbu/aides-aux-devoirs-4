import React, { useState, useEffect } from 'react';
import { Wallet, Plus, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ParentWalletProps {
  childId: string;
}

const ParentWallet: React.FC<ParentWalletProps> = ({ childId }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (childId) {
      loadWalletData();
    }
  }, [childId]);

  const loadWalletData = async () => {
    try {
      // Get wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', childId)
        .single();

      if (wallet) {
        setBalance(wallet.balance);

        // Get transactions
        const { data: transactions } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });

        setTransactions(transactions || []);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', childId)
        .single();

      if (!wallet) throw new Error('Wallet not found');

      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance + amountNumber
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert([{
          wallet_id: wallet.id,
          amount: amountNumber,
          type: 'credit',
          description: 'Rechargement par parent',
          transaction_type: 'wallet'
        }]);

      if (transactionError) throw transactionError;

      await loadWalletData();
      setShowAddFunds(false);
      setAmount('');
      toast.success('Cagnotte rechargée avec succès');
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('Erreur lors du rechargement de la cagnotte');
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      {/* Solde */}
      <div className={cardClasses}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-[#ff5734]/10 p-3 rounded-xl">
              <Wallet className="h-6 w-6 text-[#ff5734]" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-[#151313]">Cagnotte</h2>
              <p className="text-3xl font-bold text-[#ff5734]">
                {balance.toFixed(2)} izicoins
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddFunds(true)}
            className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
          >
            <Plus className="h-5 w-5 mr-2" />
            Recharger
          </button>
        </div>
      </div>

      {/* Historique des transactions */}
      <div className={cardClasses}>
        <div className="flex items-center mb-6">
          <History className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-[#151313]">Historique des transactions</h3>
        </div>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-[#f7f7f5]"
            >
              <div>
                <p className="font-medium text-[#151313]">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
              <div className={`font-medium ${
                transaction.type === 'credit' ? 'text-[#ff5734]' : 'text-[#151313]'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} izicoins
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'ajout de fonds */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#151313]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-[#151313]">Recharger la cagnotte</h3>
              <button
                onClick={() => setShowAddFunds(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#151313] mb-1">
                  Montant (izicoins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="px-4 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddFunds}
                  className="px-4 py-2 text-white bg-[#ff5734] border border-[#151313] rounded-xl hover:bg-[#ff5734]/80"
                >
                  Recharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentWallet;