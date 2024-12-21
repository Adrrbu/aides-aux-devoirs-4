import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Clock, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamAdded: () => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({ isOpen, onClose, onExamAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    topic: '',
    dueDate: '',
    dueTime: '',
    description: '',
    priority: '1',
    document: null as File | null
  });

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
      // Reset form data when modal opens
      setFormData({
        title: '',
        subject: '',
        topic: '',
        dueDate: '',
        dueTime: '',
        description: '',
        priority: '1',
        document: null
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.subject) {
      loadTopics(formData.subject);
    } else {
      setTopics([]);
      setFormData(prev => ({ ...prev, topic: '' }));
    }
  }, [formData.subject]);

  const loadSubjects = async () => {
    try {
      console.log('Loading subjects...');
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error loading subjects:', error);
        throw error;
      }

      console.log('Loaded subjects:', data);
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast.error('Erreur lors du chargement des matières');
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      console.log('Loading topics for subject:', subjectId);
      const { data, error } = await supabase
        .from('subject_topics')
        .select('id, name')
        .eq('subject_id', subjectId)
        .order('name');

      if (error) {
        console.error('Error loading topics:', error);
        throw error;
      }

      console.log('Loaded topics:', data);
      setTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Erreur lors du chargement des sous-matières');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Upload du document si présent
      let documentUrl = null;
      if (formData.document) {
        const fileExt = formData.document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `exam-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('exam-documents')
          .upload(filePath, formData.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('exam-documents')
          .getPublicUrl(filePath);

        documentUrl = publicUrl;
      }

      // Création du contrôle
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();

      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert([{
          user_id: user.id,
          title: formData.title,
          subject_id: formData.subject,
          topic_id: formData.topic || null,
          due_date: dueDateTime,
          description: formData.description,
          priority: parseInt(formData.priority),
          document_url: documentUrl
        }])
        .select()
        .single();

      if (examError) throw examError;

      // Création du contenu initial
      const { error: contentError } = await supabase
        .from('exam_content')
        .insert([{
          exam_id: exam.id,
          course_content: null,
          revision_content: null,
          quiz_content: null
        }]);

      if (contentError) throw contentError;

      toast.success('Contrôle ajouté avec succès');
      onExamAdded();
      onClose();
    } catch (error) {
      console.error('Error adding exam:', error);
      toast.error('Erreur lors de l\'ajout du contrôle');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg border border-[#151313] max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl flex-shrink-0">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-[#151313] mr-3" />
              <h2 className="text-xl font-semibold text-[#151313]">Ajouter un contrôle</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#151313] mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#151313] mb-1">
                    Matière
                  </label>
                  <select
                    required
                    className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value, topic: '' })}
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#151313] mb-1">
                    Sous-matière
                  </label>
                  <select
                    className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    disabled={!formData.subject}
                  >
                    <option value="">Sélectionner une sous-matière</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#151313] mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#151313] mb-1">
                    Heure
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      required
                      className="pl-10 w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#151313] mb-1">
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#151313] mb-1">
                  Priorité
                </label>
                <select
                  required
                  className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="1">Faible</option>
                  <option value="2">Moyenne</option>
                  <option value="3">Haute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#151313] mb-1">
                  Document (optionnel)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#151313] border-dashed rounded-xl bg-white">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-xl font-medium text-[#ff5734] hover:text-[#ff5734]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ff5734]">
                        <span>Télécharger un fichier</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
            </form>
          </div>

          <div className="border-t p-6 flex justify-center space-x-4 bg-white rounded-b-2xl flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-32 px-4 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-[#f7f7f5]"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-32 px-4 py-2 text-white bg-[#ff5734] border border-[#151313] rounded-xl hover:bg-[#ff5734]/80 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddExamModal;