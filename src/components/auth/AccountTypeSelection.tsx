import React from 'react';
import { User, Users } from 'lucide-react';

interface AccountTypeSelectionProps {
  onSelect: (type: 'student' | 'parent') => void;
}

const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#151313]">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choisissez le type de compte que vous souhaitez créer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('student')}
          className="flex flex-col items-center p-6 border-2 border-[#151313] rounded-xl hover:border-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
        >
          <div className="w-16 h-16 bg-[#ff5734]/10 rounded-xl flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-[#ff5734]" />
          </div>
          <h3 className="text-lg font-semibold text-[#151313]">Compte élève</h3>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Pour accéder aux cours, exercices et suivre votre progression
          </p>
        </button>

        <button
          onClick={() => onSelect('parent')}
          className="flex flex-col items-center p-6 border-2 border-[#151313] rounded-xl hover:border-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
        >
          <div className="w-16 h-16 bg-[#ff5734]/10 rounded-xl flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-[#ff5734]" />
          </div>
          <h3 className="text-lg font-semibold text-[#151313]">Compte parent</h3>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Pour suivre les progrès de vos enfants et gérer leur cagnotte
          </p>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => onSelect('student')}
          className="text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
};

export default AccountTypeSelection;