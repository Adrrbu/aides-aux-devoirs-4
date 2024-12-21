import React, { useState } from 'react';
import { Clock, Trash2, FileText, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/openai';
import toast from 'react-hot-toast';
import RevisionSessionModal from './RevisionSessionModal';

interface CalendarEventProps {
  event: {
    id: string;
    title: string;
    description?: string;
    event_type: 'task' | 'course' | 'revision';
    start_time: string;
    end_time: string;
    color?: string;
    attachment_url?: string;
    exam_id?: string;
  };
  onDelete: () => void;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);

  const handleRevisionClick = async () => {
    if (event.event_type !== 'revision' || !event.exam_id) return;
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`p-3 rounded-lg ${event.color || (
          event.event_type === 'course'
            ? 'bg-green-100'
            : event.event_type === 'revision'
            ? 'bg-purple-100 cursor-pointer hover:bg-purple-200'
            : 'bg-gray-100'
        )}`}
        onClick={event.event_type === 'revision' ? handleRevisionClick : undefined}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">{event.title}</h4>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {format(startTime, 'HH:mm', { locale: fr })} - {format(endTime, 'HH:mm', { locale: fr })}
              </span>
            </div>
            {event.description && (
              <p className="mt-1 text-sm text-gray-600">{event.description}</p>
            )}
            {event.attachment_url && (
              <a
                href={event.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <FileText className="h-4 w-4 mr-1" />
                Pièce jointe
              </a>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-white/50"
            title="Supprimer l'événement"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isModalOpen && event.exam_id && (
        <RevisionSessionModal
          examId={event.exam_id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default CalendarEvent;