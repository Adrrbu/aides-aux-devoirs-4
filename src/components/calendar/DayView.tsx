import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Plus } from 'lucide-react';
import TimeGrid from '../TimeGrid';
import CalendarEvent from './CalendarEvent';

interface DayViewProps {
  date: Date;
  events: any[];
  onBack: () => void;
  onDeleteEvent: (id: string) => void;
  onTimeSelect: (start: string, end: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  onBack,
  onDeleteEvent,
  onTimeSelect
}) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#f7f7f5] rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-[#151313]" />
        </button>
        <h2 className="text-lg font-semibold text-[#151313]">
          {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>
        <button
          className="p-2 bg-[#ff5734] text-white rounded-full hover:bg-[#ff5734]/80"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Time Grid */}
      <div className={`${cardClasses} h-[calc(100vh-16rem)]`}>
        <TimeGrid
          selectedDate={date}
          onTimeSelect={onTimeSelect}
          events={events}
        />
      </div>

      {/* Events List */}
      <div className={cardClasses}>
        <h3 className="text-lg font-medium text-[#151313] mb-4">
          Événements du jour
        </h3>
        <div className="space-y-2">
          {events.length > 0 ? (
            events.map((event) => (
              <CalendarEvent
                key={event.id}
                event={event}
                onDelete={() => onDeleteEvent(event.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucun événement prévu ce jour
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;