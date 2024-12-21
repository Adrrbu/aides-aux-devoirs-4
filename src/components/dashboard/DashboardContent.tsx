import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import DashboardSkeleton from './DashboardSkeleton';
import RecentActivities from './RecentActivities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import StatsCards from './StatsCards';
import ProgressCards from './ProgressCards';

interface DashboardContentProps {
  setActiveTab: (tab: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ setActiveTab }) => {
  const { data, loading, error } = useDashboardData();
  const cardClasses = "rounded-2xl p-6 shadow-sm border border-[#151313]";

  console.log('DashboardContent render:', { loading, error, data });

  if (loading) {
    console.log('Showing loading skeleton');
    return <DashboardSkeleton />;
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="text-red-600">
        Une erreur est survenue lors du chargement des données: {error}
      </div>
    );
  }

  if (!data) {
    console.log('No dashboard data available');
    return null;
  }

  console.log('Rendering dashboard with data:', data);

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#151313]">Bienvenue sur ton Dashboard</h1>
        <p className="mt-2 text-gray-600">Retrouve ici tous tes cours et ta progression</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress and Activities */}
        <div className="lg:col-span-2 space-y-6">
          <StatsCards setActiveTab={setActiveTab} />
          <ProgressCards progressData={data.progressData} />

          {/* Recent Activities */}
          <div className={`${cardClasses} bg-white`}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-[#151313]">Activités récentes</h2>
            </div>
            <div className="h-[150px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              <RecentActivities limit={2} />
            </div>
          </div>
        </div>

        {/* Right Column - Calendar and Stats */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className={`${cardClasses} bg-white`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#151313]">Planning</h2>
              <button 
                onClick={() => setActiveTab('planning')}
                className="text-[#ff5734] hover:text-[#ff5734]/80 text-sm flex items-center"
              >
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="text-sm font-medium text-[#151313] mb-2">
              {format(new Date(), 'MMMM yyyy', { locale: fr })}
            </div>
            {/* Calendar content */}
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <div key={`header-${index}`} className="text-xs text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={`day-${i}`}
                  className={`text-xs text-center py-1 rounded-full cursor-pointer ${
                    i + 1 === new Date().getDate()
                      ? 'bg-[#ff5734] text-white'
                      : 'text-[#151313] hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={`${cardClasses} bg-white`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#151313]">Statistiques</h2>
              <button 
                onClick={() => setActiveTab('stats')}
                className="text-[#ff5734] hover:text-[#ff5734]/80 text-sm flex items-center"
              >
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Temps d'étude</p>
                  <p className="text-2xl font-bold text-[#151313]">3.5h</p>
                </div>
                <div className="bg-[#be94f5] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  +15%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Exercices complétés</p>
                  <p className="text-2xl font-bold text-[#151313]">{data.statistics.completedExercises}</p>
                </div>
                <div className="bg-[#be94f5] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  +{data.statistics.monthlyProgress}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;