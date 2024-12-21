import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import TimeGrid from './TimeGrid';
import CalendarEvent from './calendar/CalendarEvent';
import DayView from './calendar/DayView';
import AddEventModal from './calendar/AddEventModal';
import { CalendarEvent as ICalendarEvent } from '../types/calendar';
import { getMonthEvents, getDayEvents, deleteEvent } from '../services/calendar';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<{ [key: string]: ICalendarEvent[] }>({});
  const [selectedDateEvents, setSelectedDateEvents] = useState<ICalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{ start: string; end: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    const handleResize = () => {
      setShowMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      loadSelectedDateEvents();
    }
  }, [selectedDate, events]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const eventsByDate = await getMonthEvents(monthStart, monthEnd);
      setEvents(eventsByDate);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSelectedDateEvents = async () => {
    try {
      const events = await getDayEvents(selectedDate);
      setSelectedDateEvents(events);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des événements');
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (showMobileView) {
      setShowDayView(true);
    }
  };

  const handleTimeSelect = (start: string, end: string) => {
    setSelectedTime({ start, end });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      await loadEvents();
      await loadSelectedDateEvents();
      toast.success('Événement supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const weekDaysFull = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  if (showMobileView && showDayView) {
    return (
      <DayView
        date={selectedDate}
        events={selectedDateEvents}
        onBack={() => setShowDayView(false)}
        onDeleteEvent={handleDeleteEvent}
        onTimeSelect={handleTimeSelect}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff5734]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#151313]">Planning</h2>
        </div>

        {showMobileView ? (
          <div className="space-y-4">
            {/* Mobile Header */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#151313]">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="p-2 hover:bg-[#f7f7f5] rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5 text-[#151313]" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="p-2 hover:bg-[#f7f7f5] rounded-full"
                  >
                    <ChevronRight className="h-5 w-5 text-[#151313]" />
                  </button>
                </div>
              </div>

              {/* Mobile Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => (
                  <div key={`header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {days.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEvents = events[dateKey] || [];
                  return (
                    <div
                      key={dateKey}
                      onClick={() => handleDateClick(day)}
                      className={`
                        relative py-1 px-1 text-xs h-10
                        ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-[#151313]'}
                        ${isToday(day) ? 'bg-[#ff5734] text-white' : ''}
                        ${selectedDate && isSameDay(day, selectedDate) ? 'bg-[#ff5734]/20' : ''}
                        hover:bg-[#f7f7f5] cursor-pointer rounded-lg transition-colors
                      `}
                    >
                      <span className="block text-center">{format(day, 'd')}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="flex -space-x-1">
                            {dayEvents.slice(0, 3).map((event, index) => (
                              <div
                                key={`dot-${event.id}`}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  event.color || (
                                    event.event_type === 'course'
                                      ? 'bg-[#be94f5]'
                                      : event.event_type === 'revision'
                                      ? 'bg-[#fccc42]'
                                      : 'bg-[#ff5734]'
                                  )
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-12rem)] flex space-x-6">
            {/* Desktop Calendar */}
            <div className={`w-2/3 ${cardClasses}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#151313]">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="p-2 hover:bg-[#f7f7f5] rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5 text-[#151313]" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="p-2 hover:bg-[#f7f7f5] rounded-full"
                  >
                    <ChevronRight className="h-5 w-5 text-[#151313]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weekDaysFull.map((day, index) => (
                  <div key={`header-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEvents = events[dateKey] || [];
                  return (
                    <div
                      key={dateKey}
                      onClick={() => handleDateClick(day)}
                      className={`
                        relative py-2 px-1 text-sm h-24
                        ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-[#151313]'}
                        ${isToday(day) ? 'bg-[#ff5734] text-white' : ''}
                        ${selectedDate && isSameDay(day, selectedDate) ? 'bg-[#ff5734]/20' : ''}
                        hover:bg-[#f7f7f5] cursor-pointer rounded-lg transition-colors
                      `}
                    >
                      <span className="block text-center mb-1">{format(day, 'd')}</span>
                      <div className="max-h-16 overflow-y-auto px-1 space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${event.color || (
                              event.event_type === 'course'
                                ? 'bg-[#be94f5] text-white'
                                : event.event_type === 'revision'
                                ? 'bg-[#fccc42] text-[#151313]'
                                : 'bg-[#ff5734] text-white'
                            )}`}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Day View */}
            <div className={`w-1/3 ${cardClasses} flex flex-col`}>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#151313]">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
              </div>

              <TimeGrid
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSelect}
                events={selectedDateEvents}
              />

              <div className="mt-6">
                <h4 className="text-sm font-medium text-[#151313] mb-2">Événements du jour</h4>
                <div className="space-y-2">
                  {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map((event) => (
                      <CalendarEvent
                        key={event.id}
                        event={event}
                        onDelete={() => handleDeleteEvent(event.id)}
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
          </div>
        )}
      </div>

      {showEventForm && selectedTime && (
        <AddEventModal
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onEventAdded={() => {
            loadEvents();
            loadSelectedDateEvents();
          }}
        />
      )}
    </>
  );
};

export default Calendar;