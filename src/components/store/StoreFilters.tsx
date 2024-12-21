import React from 'react';
import { Search } from 'lucide-react';
import { StoreFilters as FilterType } from '../../types/store';

interface StoreFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const CATEGORIES = [
  { id: 'all', name: 'Toutes les catégories' },
  { id: 'gaming', name: 'Jeux vidéo' },
  { id: 'entertainment', name: 'Divertissement' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'sport', name: 'Sport' }
];

const PRICE_RANGES = [
  { id: 'all', name: 'Tous les prix' },
  { id: '0-20', name: 'Moins de 20 izicoins' },
  { id: '20-50', name: 'De 20 à 50 izicoins' },
  { id: '50+', name: 'Plus de 50 izicoins' }
];

const StoreFilters: React.FC<StoreFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value });
  };

  const handlePriceRangeChange = (value: string) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  return (
    <div className="bg-white rounded-xl border border-[#151313] p-4 space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une carte cadeau..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Catégorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Prix
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="w-full rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;