import React, { useState } from 'react';
import { Calendar, Clock, Check, Plus, Edit2, Save } from 'lucide-react';
import { format, addDays, differenceInDays, parseISO, isBefore, isValid, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface RevisionSession {
  id: string;
  date: string;
  time: string;
  topic: string;
  selected: boolean;
  isEditing?: boolean;
}

interface RevisionPlanProps {
  examId: string;
  examTitle: string;
  dueDate: string;
  content: string;
}

const DEFAULT_TIMES = ['10:00', '14:00', '16:00', '18:00'];
const SESSION_DURATION = 2; // Durée en heures

const RevisionPlan: React.FC<RevisionPlanProps> = ({ examId, examTitle, dueDate, content }) => {
  const [sessions, setSessions] = useState<RevisionSession[]>(() => {
    const today = new Date();
    const examDate = parseISO(dueDate);
    const daysUntilExam = differenceInDays(examDate, today);
    
    const sections = content.match(/<h2[^>]*>(.*?)<\/h2>/g)?.map(h => 
      h.replace(/<[^>]+>/g, '').trim()
    ) || ['Révision générale'];

    const numberOfSessions = Math.max(4, Math.min(daysUntilExam - 1, sections.length * 2));
    
    return Array.from({ length: numberOfSessions }).map((_, index) => {
      const daysToAdd = Math.floor(index * (daysUntilExam / numberOfSessions));
      const sessionDate = addDays(today, daysToAdd);
      const sectionIndex = Math.min(Math.floor(index / 2), sections.length - 1);
      const timeIndex = index % DEFAULT_TIMES.length;
      
      return {
        id: `session-${index}`,
        date: format(sessionDate, 'yyyy-MM-dd'),
        time: DEFAULT_TIMES[timeIndex],
        topic: sections[sectionIndex],
        selected: true,
        isEditing: false
      };
    });
  });

  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSessionToggle = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, selected: !session.selected } : session
    ));
  };

  const startEditing = (session: RevisionSession) => {
    setEditingSession(session.id);
    setTempDate(session.date);
    setTempTime(session.time);
  };

  const saveEditing = (sessionId: string) => {
    if (!isValid(parseISO(tempDate))) {
      toast.error('Date invalide');
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(tempTime)) {
      toast.error('Heure invalide');
      return;
    }

    if (isBefore(parseISO(dueDate), parseISO(tempDate))) {
      toast.error('La session ne peut pas être après la date du contrôle');
      return;
    }

    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, date: tempDate, time: tempTime, isEditing: false }
        : session
    ));
    setEditingSession(null);
  };

  const addToCalendar = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const selectedSessions = sessions.filter(s => s.selected);
      
      if (selectedSessions.length === 0) {
        toast.error('Veuillez sélectionner au moins une session');
        return;
      }

      const { data: existingEvents, error: fetchError } = await supabase
        .from('calendar_events')
        .select('start_time, end_time')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const events = selectedSessions.map(session => {
        const startTime = `${session.date}T${session.time}:00`;
        const endTime = format(
          addHours(parseISO(`${session.date}T${session.time}`), SESSION_DURATION),
          "yyyy-MM-dd'T'HH:mm:ss"
        );

        const hasOverlap = existingEvents?.some(event => {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);
          const sessionStart = new Date(startTime);
          const sessionEnd = new Date(endTime);

          return (
            (sessionStart >= eventStart && sessionStart < eventEnd) ||
            (sessionEnd > eventStart && sessionEnd <= eventEnd) ||
            (sessionStart <= eventStart && sessionEnd >= eventEnd)
          );
        });

        if (hasOverlap) {
          throw new Error(`Chevauchement détecté pour la session du ${format(parseISO(session.date), 'dd/MM/yyyy')} à ${session.time}`);
        }

        return {
          user_id: user.id,
          title: `Révision ${examTitle}: ${session.topic}`,
          event_type: 'revision',
          start_time: startTime,
          end_time: endTime,
          description: `Session de révision pour le contrôle de ${examTitle}`,
          exam_id: examId,
          color: 'bg-purple-100 text-purple-800'
        };
      });

      const { error: insertError } = await supabase
        .from('calendar_events')
        .insert(events);

      if (insertError) throw insertError;

      toast.success('Plan de révision ajouté au calendrier');
    } catch (error: any) {
      console.error('Error adding revision plan to calendar:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du plan de révision');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-[#151313]">
          Plan de révision suggéré
        </h3>
        <button
          onClick={addToCalendar}
          disabled={isSubmitting}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Ajout en cours...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Mettre ce plan dans l'agenda
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#151313]">
        <p className="text-sm text-gray-600 mb-6">
          Voici un plan de révision optimisé pour préparer votre contrôle du{' '}
          {format(parseISO(dueDate), 'dd MMMM yyyy', { locale: fr })}
        </p>

        <div className="space-y-4">
          {sessions.map((session) => {
            const sessionDate = parseISO(session.date);
            const isPastSession = isBefore(sessionDate, new Date());

            return (
              <div
                key={session.id}
                className={`flex flex-col p-4 rounded-xl border ${
                  isPastSession ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#151313]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={session.selected}
                      onChange={() => handleSessionToggle(session.id)}
                      disabled={isPastSession}
                      className="h-4 w-4 text-[#ff5734] focus:ring-[#ff5734] border-[#151313] rounded"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingSession === session.id ? (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="date"
                          value={tempDate}
                          onChange={(e) => setTempDate(e.target.value)}
                          className="flex-1 rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
                          min={format(new Date(), 'yyyy-MM-dd')}
                          max={format(parseISO(dueDate), 'yyyy-MM-dd')}
                        />
                        <input
                          type="time"
                          value={tempTime}
                          onChange={(e) => setTempTime(e.target.value)}
                          className="flex-1 rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
                        />
                        <button
                          onClick={() => saveEditing(session.id)}
                          className="w-full sm:w-auto px-4 py-2 text-white bg-[#ff5734] rounded-xl hover:bg-[#ff5734]/80"
                        >
                          <Save className="h-4 w-4 sm:hidden" />
                          <span className="hidden sm:inline">Enregistrer</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium text-[#151313]">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {format(sessionDate, 'EEEE d MMMM', { locale: fr })}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {session.time} - {format(addHours(parseISO(`${session.date}T${session.time}`), SESSION_DURATION), 'HH:mm')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-[#151313] truncate">
                              {session.topic}
                            </span>
                            {!isPastSession && !editingSession && (
                              <button
                                onClick={() => startEditing(session)}
                                className="p-2 text-gray-400 hover:text-[#ff5734] rounded-xl hover:bg-gray-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#f7f7f5] rounded-xl p-4 text-sm text-gray-600">
        <p className="mb-2">
          Ce plan a été généré en fonction de la date du contrôle et du contenu à réviser.
          Chaque session dure {SESSION_DURATION} heures.
        </p>
        <p>
          Vous pouvez modifier les dates et heures en cliquant sur l'icône de modification,
          ou décocher les sessions qui ne vous conviennent pas avant d'ajouter le plan à votre agenda.
        </p>
      </div>
    </div>
  );
};

export default RevisionPlan;
