import React, { useEffect } from 'react';
import { X, Trophy, Star } from 'lucide-react';

interface RewardsScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardsScaleModal: React.FC<RewardsScaleModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const scales = [
    { range: '100%', reward: 1.00, color: '#fccc42', icon: Trophy },
    { range: '75-99%', reward: 0.75, color: '#be94f5', icon: Star },
    { range: '50-74%', reward: 0.50, color: '#ff5734', icon: Star },
    { range: '25-49%', reward: 0.25, color: '#151313', icon: Star },
    { range: '0-24%', reward: 0, color: '#9ca3af', icon: Star },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay avec blur sur tout l'écran */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Container centré */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-md border border-[#151313] shadow-xl transform transition-all">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-[#fccc42] rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-[#151313]">
                Barème des izicoins
              </h3>
              <button
                onClick={onClose}
                className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-gray-600">
                Gagnez des izicoins en fonction de vos performances aux exercices et quiz !
              </p>

              <div className="space-y-3 sm:space-y-4">
                {scales.map(({ range, reward, color, icon: Icon }) => (
                  <div
                    key={range}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-[#151313] bg-white hover:border-[#ff5734] transition-colors"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-[#151313]">
                        {range}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm sm:text-base font-bold" style={{ color }}>
                        {reward.toFixed(2)}
                      </span>
                      <span className="ml-1 text-xs sm:text-sm text-gray-500">
                        izicoins
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#f7f7f5] p-3 sm:p-4 rounded-xl">
                <p className="text-xs sm:text-sm text-gray-600">
                  Les izicoins gagnés peuvent être utilisés dans le magasin pour obtenir des récompenses !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsScaleModal;
