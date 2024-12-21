import React, { useState, useEffect } from 'react';
import { X, BookOpen, FileText, Brain, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/openai';
import toast from 'react-hot-toast';
import Quiz from '../Quiz';
import RevisionPlan from '../exams/RevisionPlan';

interface RevisionSessionModalProps {
  examId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RevisionSessionModal: React.FC<RevisionSessionModalProps> = ({ examId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'course' | 'revision' | 'quiz' | 'plan'>('course');
  const [isLoading, setIsLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [content, setContent] = useState<{
    course: string;
    revision: string;
    quiz: any;
  } | null>(null);

  useEffect(() => {
    loadExamContent();
  }, [examId]);

  const loadExamContent = async () => {
    try {
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('*, exam_content(*)')
        .eq('id', examId)
        .single();

      if (examError) throw examError;
      setExamData(exam);

      if (exam.exam_content) {
        setContent({
          course: exam.exam_content.course_content,
          revision: exam.exam_content.revision_content,
          quiz: exam.exam_content.quiz_content ? JSON.parse(exam.exam_content.quiz_content) : null
        });
      }
    } catch (error) {
      console.error('Error loading exam content:', error);
      toast.error('Erreur lors du chargement du contenu');
    }
  };

  const generateContent = async (type: 'course' | 'revision' | 'quiz') => {
    if (!examData) return;
    
    try {
      setIsLoading(true);
      const prompt = `Pour un contrôle de ${examData.subject} sur le thème "${examData.title}": ${examData.description}`;
      const response = await generateResponse(prompt, type);

      const contentKey = `${type}_content`;
      const newContent = type === 'quiz' ? JSON.stringify(response) : response;

      const { error: updateError } = await supabase
        .from('exam_content')
        .update({ [contentKey]: newContent })
        .eq('exam_id', examId);

      if (updateError) throw updateError;

      await loadExamContent();
      toast.success('Contenu généré avec succès');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Erreur lors de la génération du contenu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#151313]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#151313]">Session de révision</h2>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('course')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center justify-center ${
              activeTab === 'course'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Cours
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center justify-center ${
              activeTab === 'revision'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Fiche de révision
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center justify-center ${
              activeTab === 'quiz'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center justify-center ${
              activeTab === 'plan'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Plan de révision
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-[#f7f7f5]" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
          {examData ? (
            <>
              {activeTab === 'course' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateContent('course')}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
                    >
                      {isLoading ? 'Génération...' : 'Générer le cours'}
                    </button>
                  </div>
                  {content?.course ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.course }} />
                  ) : (
                    <p className="text-center text-gray-500">Aucun contenu disponible</p>
                  )}
                </div>
              )}

              {activeTab === 'revision' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateContent('revision')}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
                    >
                      {isLoading ? 'Génération...' : 'Générer la fiche'}
                    </button>
                  </div>
                  {content?.revision ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.revision }} />
                  ) : (
                    <p className="text-center text-gray-500">Aucun contenu disponible</p>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateContent('quiz')}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
                    >
                      {isLoading ? 'Génération...' : 'Générer le quiz'}
                    </button>
                  </div>
                  {content?.quiz ? (
                    <Quiz title={content.quiz.title} questions={content.quiz.questions} />
                  ) : (
                    <p className="text-center text-gray-500">Aucun contenu disponible</p>
                  )}
                </div>
              )}

              {activeTab === 'plan' && examData && (
                <RevisionPlan
                  examId={examId}
                  examTitle={examData.title}
                  dueDate={examData.due_date}
                  content={content?.course || ''}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ff5734] mx-auto" />
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionSessionModal;