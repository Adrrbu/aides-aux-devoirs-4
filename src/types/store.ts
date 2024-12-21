export interface GiftCardData {
  id: string;
  name: string;
  image: string;
  description: string;
  values: number[];
  category: 'gaming' | 'entertainment' | 'shopping' | 'sport';
}

export interface StoreFilters {
  searchTerm: string;
  category: string;
  priceRange: string;
}