import React from 'react';
import { Brain, Target, Heart } from 'lucide-react';

interface TestSelectionProps {
  onTestSelect: (testType: 'personality' | 'aptitude' | 'interests') => void;
}

const TestSelection: React.FC<TestSelectionProps> = ({ onTestSelect }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#151313]">Trouve ta voie</h2>
      <p className="text-gray-600">
        Découvre les métiers qui te correspondent le mieux grâce à nos tests d'orientation complets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313] cursor-pointer hover:border-[#ff5734] transition-colors"
          onClick={() => onTestSelect('personality')}
        >
          <Brain className="h-8 w-8 text-[#ff5734] mb-4" />
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Test de personnalité</h3>
          <p className="text-gray-600 text-sm">
            Découvre les métiers qui correspondent à ta personnalité selon la méthode RIASEC.
          </p>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313] cursor-pointer hover:border-[#ff5734] transition-colors"
          onClick={() => onTestSelect('aptitude')}
        >
          <Target className="h-8 w-8 text-[#be94f5] mb-4" />
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Test d'aptitudes</h3>
          <p className="text-gray-600 text-sm">
            Évalue tes compétences dans différents domaines pour identifier tes points forts.
          </p>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313] cursor-pointer hover:border-[#ff5734] transition-colors"
          onClick={() => onTestSelect('interests')}
        >
          <Heart className="h-8 w-8 text-[#fccc42] mb-4" />
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Centres d'intérêt</h3>
          <p className="text-gray-600 text-sm">
            Explore les domaines qui te passionnent pour trouver ta voie idéale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestSelection;