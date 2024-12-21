import React from 'react';
import { ChevronRight } from 'lucide-react';

interface StatsSectionProps {
  statistics: {
    monthlyProgress: number;
    completedExercises: number;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ statistics }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Statistiques</h2>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center">
          Voir tout
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Temps d'étude</p>
            <p className="text-2xl font-bold text-gray-900">3.5h</p>
          </div>
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            +15%
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Exercices complétés</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.completedExercises}</p>
          </div>
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            +{statistics.monthlyProgress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;