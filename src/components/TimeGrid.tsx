import React, { useState, useRef, useEffect } from 'react';
import { format, addMinutes, set } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSlot {
  start: Date;
  end: Date;
}

interface TimeGridProps {
  selectedDate: Date;
  onTimeSelect: (start: string, end: string) => void;
  events: any[];
}

const TimeGrid: React.FC<TimeGridProps> = ({ selectedDate, onTimeSelect, events }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  // Générer les heures de 8h à 20h
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  
  // Hauteur d'une cellule de 15 minutes en pixels
  const CELL_HEIGHT = 15;
  const CELLS_PER_HOUR = 4;

  const getTimeFromPosition = (y: number): Date => {
    if (!gridRef.current) return new Date();
    
    const rect = gridRef.current.getBoundingClientRect();
    const relativeY = y - rect.top + gridRef.current.scrollTop;
    const totalMinutes = Math.floor(relativeY / CELL_HEIGHT) * 15;
    const hours = Math.floor(totalMinutes / 60) + 8;
    const minutes = totalMinutes % 60;
    
    return set(selectedDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0
    });
  };

  // Gestion des événements tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    const time = getTimeFromPosition(touch.clientY);
    setStartTime(time);
    setEndTime(time);
    setSelectedTimeSlot(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY || !startTime) return;
    const touch = e.touches[0];
    const time = getTimeFromPosition(touch.clientY);
    setEndTime(time);
  };

  const handleTouchEnd = () => {
    if (startTime && endTime) {
      const start = startTime < endTime ? startTime : endTime;
      const end = startTime < endTime ? endTime : startTime;
      
      setSelectedTimeSlot({ start, end });
      onTimeSelect(
        format(start, 'HH:mm'),
        format(end, 'HH:mm')
      );
    }
    setTouchStartY(null);
  };

  // Gestion des événements souris
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTouchDevice) return;
    setIsDragging(true);
    const time = getTimeFromPosition(e.clientY);
    setStartTime(time);
    setEndTime(time);
    setSelectedTimeSlot(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !startTime || isTouchDevice) return;
    const time = getTimeFromPosition(e.clientY);
    setEndTime(time);
  };

  const handleMouseUp = () => {
    if (isDragging && startTime && endTime && !isTouchDevice) {
      const start = startTime < endTime ? startTime : endTime;
      const end = startTime < endTime ? endTime : startTime;
      
      setSelectedTimeSlot({ start, end });
      onTimeSelect(
        format(start, 'HH:mm'),
        format(end, 'HH:mm')
      );
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging && !isTouchDevice) {
      handleMouseUp();
    }
  };

  const renderEvents = () => {
    return events.map((event, index) => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      
      const startMinutes = start.getHours() * 60 + start.getMinutes() - 8 * 60;
      const endMinutes = end.getHours() * 60 + end.getMinutes() - 8 * 60;
      
      const top = (startMinutes / 15) * CELL_HEIGHT;
      const height = ((endMinutes - startMinutes) / 15) * CELL_HEIGHT;

      return (
        <div
          key={event.id}
          className={`absolute left-16 right-4 rounded-lg px-2 py-1 text-xs ${
            event.event_type === 'course' 
              ? 'bg-green-100 text-green-800' 
              : event.event_type === 'revision'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
          style={{
            top: `${top}px`,
            height: `${height}px`,
            zIndex: 10,
          }}
        >
          <div className="font-medium truncate">{event.title}</div>
          <div className="text-xs opacity-75">
            {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
          </div>
        </div>
      );
    });
  };

  const renderSelectionOverlay = () => {
    if ((!isDragging && !selectedTimeSlot && !touchStartY) || (!startTime && !selectedTimeSlot)) return null;
    
    let start: Date, end: Date;
    
    if (selectedTimeSlot) {
      start = selectedTimeSlot.start;
      end = selectedTimeSlot.end;
    } else {
      start = startTime!;
      end = endTime || startTime!;
      if (start > end) {
        [start, end] = [end, start];
      }
    }
    
    const startMinutes = start.getHours() * 60 + start.getMinutes() - 8 * 60;
    const endMinutes = end.getHours() * 60 + end.getMinutes() - 8 * 60;
    
    const top = (startMinutes / 15) * CELL_HEIGHT;
    const height = ((endMinutes - startMinutes) / 15) * CELL_HEIGHT;

    return (
      <div
        className="absolute left-16 right-4 bg-indigo-100 bg-opacity-50 border-2 border-indigo-500 rounded-lg pointer-events-none"
        style={{
          top: `${top}px`,
          height: `${Math.max(height, CELL_HEIGHT)}px`,
          zIndex: 20,
        }}
      >
        {selectedTimeSlot && (
          <div className="absolute inset-x-0 -top-6 text-xs text-indigo-600 font-medium bg-white px-2 py-1 rounded-t-lg border-2 border-indigo-500 border-b-0">
            {format(selectedTimeSlot.start, 'HH:mm')} - {format(selectedTimeSlot.end, 'HH:mm')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={gridRef}
      className="relative bg-white rounded-lg shadow-sm select-none overflow-y-auto h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div 
              className="absolute left-0 w-16 flex items-center pr-2 text-xs text-gray-500 font-medium"
              style={{ top: `${(hour - 8) * CELL_HEIGHT * CELLS_PER_HOUR}px` }}
            >
              {`${hour}:00`}
            </div>
            <div 
              className="absolute left-16 right-0 border-t border-gray-200"
              style={{ top: `${(hour - 8) * CELL_HEIGHT * CELLS_PER_HOUR}px` }}
            />
            {[1, 2, 3].map((quarter) => (
              <div
                key={quarter}
                className="absolute left-16 right-0 border-t border-gray-100"
                style={{
                  top: `${((hour - 8) * CELL_HEIGHT * CELLS_PER_HOUR) + (quarter * CELL_HEIGHT)}px`
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {renderEvents()}
      {renderSelectionOverlay()}
    </div>
  );
};

export default TimeGrid;