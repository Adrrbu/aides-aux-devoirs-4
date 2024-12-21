import React from 'react';

interface ProgressData {
  subject: string;
  progress: number;
}

interface ProgressCardsProps {
  progressData: ProgressData[];
}

const SUBJECT_COLORS: Record<string, string> = {
  'Mathématiques': '#ff5734',
  'Français': '#be94f5',
  'Histoire': '#fccc42',
  'Anglais': '#151313'
};

const ProgressCards: React.FC<ProgressCardsProps> = ({ progressData }) => {
  const cardClasses = "rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {progressData.map((subject) => (
        <div key={subject.subject} className={`${cardClasses} bg-white`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#151313]">{subject.subject}</h3>
            <span className="text-sm font-medium" style={{ color: SUBJECT_COLORS[subject.subject] }}>
              {subject.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${subject.progress}%`,
                backgroundColor: SUBJECT_COLORS[subject.subject]
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressCards;