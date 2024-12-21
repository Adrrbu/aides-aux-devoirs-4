import React from 'react';
import { Grid, BookOpen, Brain, FileText, ClipboardList, BarChart3, Wand2 } from 'lucide-react';

const FILTERS = [
  { id: 'all', name: 'Tout', icon: Grid },
  { id: 'courses', name: 'Cours', icon: BookOpen },
  { id: 'exercises', name: 'Exercices', icon: Brain },
  { id: 'revision', name: 'Révisions', icon: FileText },
  { id: 'exams', name: 'Contrôles', icon: ClipboardList },
  { id: 'stats', name: 'Statistiques', icon: BarChart3 },
  { id: 'ai', name: 'Assistant IA', icon: Wand2 }
];

interface DashboardHeaderProps {
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ selectedFilter, onFilterChange }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Bienvenue sur ton Dashboard 🚀</h1>
          <p className="mt-2 text-gray-600">Retrouve ici tous tes cours et ta progression</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {filter.name}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default DashboardHeader;