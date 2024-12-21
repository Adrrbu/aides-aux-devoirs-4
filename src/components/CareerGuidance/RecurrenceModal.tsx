import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { addMonths, addDays, format, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  testType: string;
}

const RECURRENCE_OPTIONS = [
  { value: '1', label: 'Une fois par mois', days: 30 },
  { value: '3', label: 'Une fois par trimestre', days: 90 },
  { value: '6', label: 'Une fois tous les 6 mois', days: 180 },
  { value: '12', label: 'Une fois par an', days: 365 }
];

const RecurrenceModal: React.FC<RecurrenceModalProps> = ({ isOpen, onClose, testType }) => {
  const [recurrence, setRecurrence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTestTitle = (type: string) => {
    switch (type) {
      case 'personality':
        return 'Test de personnalité';
      case 'aptitude':
        return 'Test d\'aptitudes';
      case 'interests':
        return 'Test des centres d\'intérêt';
      default:
        return 'Test d\'orientation';
    }
  };

  const scheduleRecurringTests = async () => {
    if (!recurrence) {
      toast.error('Veuillez sélectionner une récurrence');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const selectedOption = RECURRENCE_OPTIONS.find(opt => opt.value === recurrence);
      if (!selectedOption) throw new Error('Option de récurrence invalide');

      const events = [];
      let currentDate = new Date();
      
      // Create 4 occurrences
      for (let i = 0; i < 4; i++) {
        const eventDate = addDays(currentDate, i * selectedOption.days);
        const startTime = setMinutes(setHours(eventDate, 10), 0); // 10:00
        const endTime = setMinutes(setHours(eventDate, 10), 10); // 10:10

        events.push({
          user_id: user.id,
          title: `${getTestTitle(testType)} - Récurrent`,
          description: `Session programmée de test d'orientation - ${getTestTitle(testType)}`,
          event_type: 'task',
          start_time: format(startTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          end_time: format(endTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          color: '#be94f5',
          recurrence: selectedOption.value
        });
      }

      const { error } = await supabase
        .from('calendar_events')
        .insert(events);

      if (error) throw error;

      toast.success('Tests programmés avec succès');
      onClose();
    } catch (error) {
      console.error('Error scheduling tests:', error);
      toast.error('Erreur lors de la programmation des tests');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md border border-[#151313]">
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-[#151313] mr-3" />
            <h2 className="text-xl font-semibold text-[#151313]">Programmer les tests</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Choisissez la fréquence à laquelle vous souhaitez repasser le {getTestTitle(testType).toLowerCase()} 
            pour suivre votre évolution.
          </p>

          <div className="space-y-4">
            {RECURRENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRecurrence(option.value)}
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  recurrence === option.value
                    ? 'border-[#ff5734] bg-[#ff5734]/5'
                    : 'border-[#151313] hover:border-[#ff5734]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#151313]">{option.label}</span>
                  {recurrence === option.value && (
                    <div className="h-2 w-2 rounded-full bg-[#ff5734]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-[#f7f7f5]"
            >
              Annuler
            </button>
            <button
              onClick={scheduleRecurringTests}
              disabled={isSubmitting || !recurrence}
              className={`px-4 py-2 text-white border border-[#151313] rounded-xl ${
                isSubmitting || !recurrence
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
              }`}
            >
              {isSubmitting ? 'Programmation...' : 'Programmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceModal;