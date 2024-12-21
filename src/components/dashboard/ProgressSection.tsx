import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProgressData {
  subject: string;
  progress: number;
}

interface ProgressSectionProps {
  progressData: ProgressData[];
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ progressData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Progression</h2>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center">
          Voir tout
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        {progressData.map((subject) => (
          <div key={subject.subject}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{subject.subject}</span>
              <span className="text-sm font-medium text-indigo-600">
                {subject.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${subject.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSection;