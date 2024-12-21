import React, { useState } from 'react';
import { Upload, X, Send } from 'lucide-react';

interface ContactFormProps {
  selectedCategory: string;
  onSubmit: (formData: {
    category: string;
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    attachments?: File[];
  }) => void;
  isSubmitting: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  selectedCategory,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      await onSubmit({
        category: selectedCategory,
        ...formData,
        attachments
      });
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'medium'
      });
      setAttachments([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Sujet
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ex: Suggestion d'amélioration pour..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Message
          </label>
          <textarea
            required
            className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Décrivez votre retour en détail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Priorité
          </label>
          <select
            className="w-full rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#151313] mb-1">
            Pièces jointes (optionnel)
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
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF jusqu'à 10MB
              </p>
            </div>
          </div>

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !selectedCategory}
            className={`inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
              isSubmitting || !selectedCategory
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;