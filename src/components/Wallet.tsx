import React, { useState } from 'react';
import { Wallet as WalletIcon, TrendingUp, History, Gift, Trophy, Lock } from 'lucide-react';
import GiftCardModal from './GiftCardModal';

const Wallet: React.FC = () => {
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState(false);
  const balance = 150; // Solde fixe pour l'exemple
  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 50,
      date: '2024-03-15',
      description: 'Bonus de parrainage'
    },
    {
      id: 2,
      type: 'credit',
      amount: 100,
      date: '2024-03-10',
      description: 'Crédit initial'
    }
  ];

  const milestones = [
    {
      points: 100,
      reward: 10,
      description: 'Complétez 10 exercices',
      progress: 100,
      unlocked: true
    },
    {
      points: 250,
      reward: 20,
      description: 'Maintenez une moyenne de 80%',
      progress: 60,
      unlocked: false
    },
    {
      points: 500,
      reward: 30,
      description: 'Terminez un module complet',
      progress: 30,
      unlocked: false
    },
    {
      points: 750,
      reward: 40,
      description: 'Obtenez 5 badges d\'excellence',
      progress: 20,
      unlocked: false
    },
    {
      points: 1000,
      reward: 50,
      description: 'Complétez tous les exercices du mois',
      progress: 10,
      unlocked: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Solde actuel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <WalletIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Solde actuel</h2>
              <p className="text-3xl font-bold text-indigo-600">{balance}€</p>
            </div>
          </div>
          <button 
            onClick={() => setIsGiftCardModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Gift className="h-5 w-5 mr-2" />
            Cartes cadeaux
          </button>
        </div>
      </div>

      {/* Objectifs et récompenses */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Trophy className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Objectifs et récompenses</h3>
        </div>
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div key={milestone.points} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {milestone.unlocked ? (
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <span className="font-medium text-gray-900">{milestone.description}</span>
                </div>
                <span className={`font-bold ${milestone.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                  {milestone.reward}€
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    milestone.unlocked ? 'bg-green-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{milestone.progress}%</span>
                <span>{milestone.points} points requis</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <History className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Historique des transactions</h3>
        </div>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className={`font-medium ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}€
              </div>
            </div>
          ))}
        </div>
      </div>

      <GiftCardModal 
        isOpen={isGiftCardModalOpen}
        onClose={() => setIsGiftCardModalOpen(false)}
        balance={balance}
      />
    </div>
  );
};

export default Wallet;