import React from 'react';
import { X, Gift } from 'lucide-react';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const GIFT_CARDS = [
  {
    id: 'fnac',
    name: 'Carte FNAC',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60',
    values: [10, 20, 30, 50],
    description: 'Valable sur tout le site fnac.com et en magasin'
  },
  {
    id: 'fortnite',
    name: 'V-Bucks Fortnite',
    image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&auto=format&fit=crop&q=60',
    values: [10, 20, 30, 50],
    description: 'Pour acheter des skins et des objets dans Fortnite'
  },
  {
    id: 'playstation',
    name: 'PlayStation Store',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60',
    values: [10, 20, 50],
    description: 'Pour acheter des jeux et du contenu sur le PS Store'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    image: 'https://images.unsplash.com/photo-1639452787134-bcb5cfd0569c?w=800&auto=format&fit=crop&q=60',
    values: [10, 20, 30],
    description: 'Pour les achats in-game Minecraft'
  }
];

const GiftCardModal: React.FC<GiftCardModalProps> = ({ isOpen, onClose, balance }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Cartes cadeaux</h2>
          <p className="text-sm text-gray-500 mt-1">Solde disponible: {balance}€</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GIFT_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {card.values.map((value) => (
                    <button
                      key={value}
                      disabled={balance < value}
                      className={`flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium
                        ${balance >= value 
                          ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50' 
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {value}€
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCardModal;