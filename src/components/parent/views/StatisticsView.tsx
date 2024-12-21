import React from 'react';
import { BarChart2 } from 'lucide-react';

const StatisticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#151313]">Statistiques</h2>
        <p className="text-gray-600">Visualisez les progrès de vos enfants</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313] text-center">
        <BarChart2 className="mx-auto h-12 w-12 text-[#ff5734] mb-4" />
        <h3 className="text-lg font-medium text-[#151313] mb-2">
          Statistiques en cours de développement
        </h3>
        <p className="text-gray-500">
          Cette fonctionnalité sera bientôt disponible
        </p>
      </div>
    </div>
  );
};

export default StatisticsView;