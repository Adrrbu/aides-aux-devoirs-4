import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';

interface Event {
  id: string;
  title: string;
  start_time: string;
  event_type: 'task' | 'course';
}

const WeeklyPlanning: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endDate = addDays(startDate, 7);

      const { data, error } = await supabase
        .from('calendar_events')
        .select('id, title, start_time, event_type')
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lt('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i)
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-2" />
              <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day, index) => {
        const dayEvents = getEventsForDay(day);
        const isToday = isSameDay(day, new Date());
        
        return (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-500">
              {format(day, 'EEE', { locale: fr })}
            </div>
            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center mx-auto
              ${isToday ? 'bg-indigo-100 text-indigo-700' : 'text-gray-900'}`}>
              {format(day, 'd')}
            </div>
            {dayEvents.length > 0 && (
              <div className="mt-2">
                <div className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                  {dayEvents.length} {dayEvents.length === 1 ? 'cours' : 'cours'}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyPlanning;