import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Statistics: React.FC = () => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  // Progress data over 6 months
  const progressData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Mathématiques',
        data: [65, 70, 68, 75, 82, 85],
        borderColor: '#ff5734',
        backgroundColor: 'rgba(255, 87, 52, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Français',
        data: [70, 72, 75, 78, 77, 80],
        borderColor: '#be94f5',
        backgroundColor: 'rgba(190, 148, 245, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Time spent per subject
  const timeSpentData = {
    labels: ['Mathématiques', 'Français', 'Histoire', 'Sciences', 'Anglais'],
    datasets: [{
      data: [25, 20, 15, 18, 12],
      backgroundColor: [
        '#ff5734',
        '#be94f5',
        '#fccc42',
        '#151313',
        '#f7f7f5',
      ],
      borderColor: '#151313',
      borderWidth: 1,
    }],
  };

  // Performance by exercise type
  const exerciseTypeData = {
    labels: ['Calcul', 'Géométrie', 'Algèbre', 'Problèmes'],
    datasets: [{
      label: 'Score moyen (%)',
      data: [85, 70, 75, 65],
      backgroundColor: '#ff5734',
      borderColor: '#151313',
      borderWidth: 1,
    }],
  };

  const performanceCards = [
    {
      subject: 'Mathématiques',
      score: 85,
      trend: 'up',
      change: '+5%',
      color: '#ff5734',
    },
    {
      subject: 'Français',
      score: 80,
      trend: 'up',
      change: '+3%',
      color: '#be94f5',
    },
    {
      subject: 'Histoire',
      score: 75,
      trend: 'same',
      change: '0%',
      color: '#fccc42',
    },
    {
      subject: 'Sciences',
      score: 72,
      trend: 'down',
      change: '-2%',
      color: '#151313',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-[#ff5734]" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-[#151313]" />;
      default:
        return <Minus className="h-4 w-4 text-[#be94f5]" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-[#ff5734]';
      case 'down':
        return 'text-[#151313]';
      default:
        return 'text-[#be94f5]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceCards.map((card) => (
          <div key={card.subject} className={cardClasses}>
            <h3 className="text-sm font-medium text-[#151313]">{card.subject}</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold" style={{ color: card.color }}>{card.score}%</p>
              <div className="flex items-center">
                {getTrendIcon(card.trend)}
                <span className={`ml-1 text-sm ${getTrendColor(card.trend)}`}>
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className={cardClasses}>
        <h2 className="text-lg font-medium text-[#151313] mb-4">Progression sur 6 mois</h2>
        <div className="h-[300px]">
          <Line
            data={progressData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: '#f7f7f5',
                  },
                },
                x: {
                  grid: {
                    color: '#f7f7f5',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time spent per subject */}
        <div className={cardClasses}>
          <h2 className="text-lg font-medium text-[#151313] mb-4">Temps passé par matière</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={timeSpentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Performance by exercise type */}
        <div className={cardClasses}>
          <h2 className="text-lg font-medium text-[#151313] mb-4">Performance par type d'exercice</h2>
          <div className="h-[300px]">
            <Bar
              data={exerciseTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: '#f7f7f5',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;