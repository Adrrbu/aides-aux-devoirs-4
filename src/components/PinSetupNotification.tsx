import React from 'react';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { usePinSetup } from '../hooks/usePinSetup';

interface PinSetupNotificationProps {
  onSetupClick: () => void;
}

const PinSetupNotification: React.FC<PinSetupNotificationProps> = ({ onSetupClick }) => {
  const { showNotification, hideNotification } = usePinSetup();

  if (!showNotification) return null;

  const handleSetupClick = () => {
    hideNotification();
    onSetupClick();
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#151313]">
        <div className="flex items-start gap-4">
          <div className="bg-[#ff5734]/10 p-3 rounded-xl flex-shrink-0">
            <LockKeyhole className="h-6 w-6 text-[#ff5734]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#151313] mb-2">
              Configuration importante requise
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Pour sécuriser la cagnotte de votre enfant, veuillez configurer votre code PIN parental à 4 chiffres. Ce code vous permettra de recharger le portefeuille et de contrôler les dépenses.
            </p>
            <button
              onClick={handleSetupClick}
              className="inline-flex items-center text-[#ff5734] hover:text-[#ff5734]/80 font-medium"
            >
              Configurer maintenant
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetupNotification;