import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import StoreHeader from './StoreHeader';
import StoreFilters from './StoreFilters';
import GiftCard from './GiftCard';
import { GIFT_CARDS } from './constants/giftCards';
import { useWallet } from '../../hooks/useWallet';
import { StoreFilters as FilterType } from '../../types/store';

const Store: React.FC = () => {
  const { earnedBalance, parentBalance, loading, handlePurchase, refreshWallet } = useWallet();
  const [filters, setFilters] = useState<FilterType>({
    searchTerm: '',
    category: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    refreshWallet();
  }, []);

  const filterCards = () => {
    return GIFT_CARDS.filter(card => {
      // Filtre par recherche
      const matchesSearch = card.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          card.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Filtre par catégorie
      const matchesCategory = filters.category === 'all' || card.category === filters.category;
      
      // Filtre par prix
      let matchesPrice = true;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        const cardMinValue = Math.min(...card.values);
        if (max) {
          matchesPrice = cardMinValue >= min && cardMinValue <= max;
        } else {
          matchesPrice = cardMinValue >= min;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff5734]"></div>
      </div>
    );
  }

  const filteredCards = filterCards();

  return (
    <div className="space-y-6">
      <StoreHeader 
        earnedBalance={earnedBalance} 
        parentBalance={parentBalance} 
      />

      <StoreFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <GiftCard
              key={card.id}
              {...card}
              balance={earnedBalance + parentBalance}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-[#151313]">
          <p className="text-gray-500">Aucune carte cadeau ne correspond à vos critères</p>
        </div>
      )}
    </div>
  );
};

export default Store;