import React from 'react';
import { Gift } from 'lucide-react';
import toast from 'react-hot-toast';

interface GiftCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  values: number[];
  balance: number;
  onPurchase: (cardId: string, amount: number) => void;
}

const GiftCard: React.FC<GiftCardProps> = ({
  id,
  name,
  image,
  description,
  values,
  balance,
  onPurchase
}) => {
  const handlePurchase = (amount: number) => {
    if (balance < amount) {
      toast.error('Solde insuffisant');
      return;
    }
    onPurchase(id, amount);
  };

  return (
    <div className="bg-white rounded-xl border border-[#151313] overflow-hidden hover:border-[#ff5734] transition-colors">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#151313]">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {values.map((value) => (
            <button
              key={value}
              onClick={() => handlePurchase(value)}
              disabled={balance < value}
              className={`flex items-center justify-center px-3 py-2 border rounded-xl text-sm font-medium
                ${balance >= value 
                  ? 'border-[#151313] text-[#151313] hover:bg-[#f7f7f5]' 
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Gift className="h-4 w-4 mr-2" />
              {value} izicoins
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCard;