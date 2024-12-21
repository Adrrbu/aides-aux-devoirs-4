import React from 'react';
import { BarChart2, TrendingUp, Clock, Trophy } from 'lucide-react';

const StatisticsOverview: React.FC = () => {
  const stats = [
    {
      label: 'Temps d\'étude moyen',
      value: '3.5h',
      change: '+15%',
      icon: Clock,
      color: '#ff5734'
    },
    {
      label: 'Exercices complétés',
      value: '127',
      change: '+8%',
      icon: Trophy,
      color: '#be94f5'
    },
    {
      label: 'Score moyen',
      value: '85%',
      change: '+5%',
      icon: TrendingUp,
      color: '#fccc42'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#151313]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-[#151313]">Statistiques</h3>
        <BarChart2 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-[#151313] bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-[#151313]">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsOverview;