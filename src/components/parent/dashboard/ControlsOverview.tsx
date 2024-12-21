import React from 'react';
import { Shield, Clock, Gift, Coins } from 'lucide-react';

const ControlsOverview: React.FC = () => {
  const controls = [
    {
      icon: Clock,
      label: 'Temps de révision',
      value: '2h par jour',
      color: '#ff5734'
    },
    {
      icon: Coins,
      label: 'Limite de jetons',
      value: '50 par semaine',
      color: '#be94f5'
    },
    {
      icon: Gift,
      label: 'Cartes cadeaux',
      value: 'Gaming uniquement',
      color: '#fccc42'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#151313]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-[#151313] mr-2" />
          <h3 className="text-lg font-medium text-[#151313]">Garde-fous actifs</h3>
        </div>
      </div>

      <div className="space-y-4">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border border-[#151313]/10 hover:border-[#151313] transition-colors"
            >
              <div className="flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: `${control.color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: control.color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#151313]">{control.label}</p>
                  <p className="text-xs text-gray-500">{control.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlsOverview;