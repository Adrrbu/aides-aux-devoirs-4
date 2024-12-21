import React, { useState } from 'react';
import { MessageCircle, HelpCircle } from 'lucide-react';
import { submitFeedback } from '../../services/feedback';
import ContactForm from './ContactForm';
import FeedbackCategories from './FeedbackCategories';
import FAQModal from './FAQ';

const Contact: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: {
    category: string;
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    attachments?: File[];
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await submitFeedback(formData);
      setSelectedCategory('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#151313] flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Nous contacter
          </h2>
          <p className="mt-2 text-gray-600">
            Nous sommes à votre écoute ! N'hésitez pas à nous faire part de vos retours, suggestions ou problèmes.
          </p>
        </div>
        <button
          onClick={() => setShowFAQ(true)}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Voir la FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories */}
        <div className="lg:col-span-1">
          <FeedbackCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm
            selectedCategory={selectedCategory}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <FAQModal 
        isOpen={showFAQ}
        onClose={() => setShowFAQ(false)}
      />
    </div>
  );
};

export default Contact;