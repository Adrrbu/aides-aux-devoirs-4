import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
}

interface CalendarSectionProps {
  upcomingCourses: CalendarEvent[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ upcomingCourses }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Planning</h2>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center">
          Voir tout
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Mini calendrier */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={`text-xs text-center py-1 rounded-full ${
                i + 1 === new Date().getDate()
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Prochains événements */}
      <div className="space-y-3">
        {upcomingCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
              <p className="text-xs text-gray-500">
                {format(new Date(course.start_time), "EEEE 'à' HH'h'mm", { locale: fr })}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSection;