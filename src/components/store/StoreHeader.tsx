import React from 'react';
import { ShoppingBag, Wallet, Gift, Trophy } from 'lucide-react';

interface StoreHeaderProps {
  earnedBalance: number;
  parentBalance: number;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ earnedBalance, parentBalance }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[#151313] flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Magasin
        </h2>
        <p className="text-gray-600 mt-1">
          Échangez vos izicoins contre des récompenses
        </p>
      </div>
      
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
        <div className="bg-white rounded-xl border border-[#151313] p-4 flex items-center gap-3">
          <Trophy className="h-5 w-5 text-[#be94f5]" />
          <div>
            <p className="text-sm text-gray-600">Solde gagné</p>
            <p className="text-xl font-bold text-[#151313]">{earnedBalance.toFixed(2)} izicoins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#151313] p-4 flex items-center gap-3">
          <Gift className="h-5 w-5 text-[#ff5734]" />
          <div>
            <p className="text-sm text-gray-600">Solde chargé</p>
            <p className="text-xl font-bold text-[#151313]">{parentBalance.toFixed(2)} izicoins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;