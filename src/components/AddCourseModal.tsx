import React, { useState, useEffect } from 'react';
import { X, Upload, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: () => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onCourseAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    topic: '',
    description: '',
    content: '',
    document: null as File | null
  });

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
      setFormData({
        title: '',
        subject: '',
        topic: '',
        description: '',
        content: '',
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
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast.error('Erreur lors du chargement des matières');
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const { data, error } = await supabase
        .from('subject_topics')
        .select('id, name')
        .eq('subject_id', subjectId)
        .order('name');

      if (error) throw error;
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

      // Get subject name for the course content
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('name')
        .eq('id', formData.subject)
        .single();

      if (subjectError) throw subjectError;

      // Get topic name if selected
      let topicName = null;
      if (formData.topic) {
        const { data: topicData, error: topicError } = await supabase
          .from('subject_topics')
          .select('name')
          .eq('id', formData.topic)
          .single();

        if (topicError) throw topicError;
        topicName = topicData.name;
      }

      // Upload document if present
      let documentUrl = null;
      if (formData.document) {
        const fileExt = formData.document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `course-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-documents')
          .upload(filePath, formData.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('course-documents')
          .getPublicUrl(filePath);

        documentUrl = publicUrl;
      }

      // Create course with proper categorization
      const { error: courseError } = await supabase
        .from('courses')
        .insert([{
          user_id: user.id,
          title: formData.title,
          subject_id: formData.subject,
          topic_id: formData.topic || null,
          description: formData.description,
          content: formData.content,
          document_url: documentUrl,
          subject_name: subjectData.name,
          topic_name: topicName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (courseError) throw courseError;

      toast.success('Cours ajouté avec succès');
      onCourseAdded();
      onClose();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Erreur lors de l\'ajout du cours');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] border border-[#151313]">
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-[#151313] mr-3" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#151313]">Ajouter un cours</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f7f7f5]">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Contenu du cours
              </label>
              <textarea
                required
                className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#151313] mb-1">
                Document (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#151313] border-dashed rounded-xl">
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

        {/* Footer */}
        <div className="flex-shrink-0 border-t p-4 sm:p-6 flex flex-col sm:flex-row justify-end gap-3 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 text-[#151313] bg-white border border-[#151313] rounded-xl hover:bg-[#f7f7f5] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-2 text-white border border-[#151313] rounded-xl transition-colors ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            }`}
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter le cours'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;