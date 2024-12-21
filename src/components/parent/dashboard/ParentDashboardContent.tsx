import React from 'react';
import { Users, Brain } from 'lucide-react';
import ChildrenOverview from './ChildrenOverview';
import StatisticsOverview from './StatisticsOverview';
import ControlsOverview from './ControlsOverview';
import ChatbotPreview from './ChatbotPreview';

const ParentDashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#151313]">Tableau de bord</h2>
          <p className="text-gray-600">Bienvenue sur votre espace parent</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ff5734] rounded-2xl p-6 border border-[#151313] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Enfants suivis</p>
              <p className="text-3xl font-bold mt-1">2</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#be94f5] rounded-2xl p-6 border border-[#151313] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Temps d'étude moyen</p>
              <p className="text-3xl font-bold mt-1">3.5h</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#fccc42] rounded-2xl p-6 border border-[#151313]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#151313]/80">Score moyen</p>
              <p className="text-3xl font-bold mt-1 text-[#151313]">85%</p>
            </div>
            <div className="p-3 bg-[#151313]/10 rounded-xl">
              <Brain className="h-6 w-6 text-[#151313]" />
            </div>
          </div>
        </div>

        <div className="bg-[#151313] rounded-2xl p-6 border border-[#151313] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Exercices complétés</p>
              <p className="text-3xl font-bold mt-1">127</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <ChildrenOverview />
          <StatisticsOverview />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <ControlsOverview />
          <ChatbotPreview />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardContent;