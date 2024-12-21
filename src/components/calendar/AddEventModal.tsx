import React, { useState } from 'react';
import { X, Upload, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: { start: string; end: string };
  onEventAdded: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onEventAdded
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'task', // 'task' | 'course' | 'revision'
    document: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Upload document if present
      let documentUrl = null;
      if (formData.document) {
        const fileExt = formData.document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `calendar-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('calendar-attachments')
          .upload(filePath, formData.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('calendar-attachments')
          .getPublicUrl(filePath);

        documentUrl = publicUrl;
      }

      // Create event
      const startDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime.start}:00`;
      const endDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime.end}:00`;

      const { error: eventError } = await supabase
        .from('calendar_events')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          event_type: formData.eventType,
          start_time: startDateTime,
          end_time: endDateTime,
          attachment_url: documentUrl
        }]);

      if (eventError) throw eventError;

      toast.success('Événement ajouté avec succès');
      onEventAdded();
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-[#151313]">Ajouter un événement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Type d'événement
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
            >
              <option value="task">Tâche</option>
              <option value="course">Cours</option>
              <option value="revision">Révision</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Titre
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border-[#151313] focus:border-[#ff5734] focus:ring-[#ff5734]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#151313] mb-1">
                Date
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-[#151313]">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#151313] mb-1">
                Horaire
              </label>
              <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-[#151313]">
                  {selectedTime.start} - {selectedTime.end}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#151313] mb-1">
              Document (optionnel)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ff5734] hover:text-[#ff5734]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ff5734]">
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files) {
                          setFormData({ ...formData, document: e.target.files[0] });
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {formData.document ? formData.document.name : 'PDF, DOC, DOCX, JPG ou PNG jusqu\'à 10MB'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff5734] border border-transparent rounded-xl hover:bg-[#ff5734]/80 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;