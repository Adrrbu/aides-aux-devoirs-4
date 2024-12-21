import React, { useState, useEffect } from 'react';
import { X, Printer, Calendar, Brain, FileText, BookOpen, Loader2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/openai';
import toast from 'react-hot-toast';
import Quiz from '../Quiz';
import RevisionPlan from './RevisionPlan';

interface ExamDetailsProps {
  exam: {
    id: string;
    title: string;
    subject: string;
    description: string;
    due_date: string;
    document_url?: string;
  };
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const ExamDetails: React.FC<ExamDetailsProps> = ({ exam, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'course' | 'revision' | 'quiz' | 'plan'>('course');
  const [isLoading, setIsLoading] = useState(false);
  const [examContent, setExamContent] = useState<any>(null);

  useEffect(() => {
    loadExamContent();
  }, [exam.id]);

  const loadExamContent = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_content')
        .select('*')
        .eq('exam_id', exam.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setExamContent(data);
    } catch (error) {
      console.error('Error loading exam content:', error);
      toast.error('Erreur lors du chargement du contenu');
    }
  };

  const generateContent = async (type: 'course' | 'revision' | 'quiz') => {
    try {
      setIsLoading(true);

      const prompt = `Pour un contrôle de ${exam.subject} sur le thème "${exam.title}": ${exam.description}`;
      const response = await generateResponse(prompt, type);

      const contentKey = `${type}_content`;
      const content = type === 'quiz' ? JSON.stringify(response) : response;

      const { data: existingContent } = await supabase
        .from('exam_content')
        .select('id')
        .eq('exam_id', exam.id)
        .single();

      if (existingContent) {
        await supabase
          .from('exam_content')
          .update({ [contentKey]: content })
          .eq('exam_id', exam.id);
      } else {
        await supabase
          .from('exam_content')
          .insert([{ exam_id: exam.id, [contentKey]: content }]);
      }

      await loadExamContent();
      toast.success('Contenu généré avec succès');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Erreur lors de la génération du contenu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contrôle ?')) return;

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', exam.id);

      if (error) throw error;

      toast.success('Contrôle supprimé avec succès');
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Erreur lors de la suppression du contrôle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#151313]">
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#151313]">{exam.title}</h2>
            <div className="mt-1 flex items-center text-sm text-[#151313]/80">
              <Calendar className="h-4 w-4 mr-1" />
              {format(parseISO(exam.due_date), 'dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDelete}
              className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#151313] hover:bg-[#fccc42]/80 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation tabs with horizontal scroll */}
        <div className="border-b overflow-x-auto whitespace-nowrap">
          <div className="flex min-w-full px-4">
            <button
              onClick={() => setActiveTab('course')}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center ${
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
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center ${
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
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center ${
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
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-center border-b-2 flex items-center ${
                activeTab === 'plan'
                  ? 'border-[#ff5734] text-[#ff5734]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Plan de révision
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-[#f7f7f5]" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
          {!examContent ? (
            <div className="space-y-6">
              <div className="text-center py-6">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-[#151313]">Générer le contenu</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choisissez le type de contenu à générer pour ce contrôle
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => generateContent('course')}
                  disabled={isLoading}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-[#151313] rounded-xl hover:border-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-[#ff5734]" />
                  <span className="mt-2 font-medium">Générer le cours</span>
                </button>

                <button
                  onClick={() => generateContent('revision')}
                  disabled={isLoading}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-[#151313] rounded-xl hover:border-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
                >
                  <FileText className="h-8 w-8 text-[#ff5734]" />
                  <span className="mt-2 font-medium">Générer la fiche</span>
                </button>

                <button
                  onClick={() => generateContent('quiz')}
                  disabled={isLoading}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-[#151313] rounded-xl hover:border-[#ff5734] hover:bg-[#f7f7f5] transition-colors"
                >
                  <Brain className="h-8 w-8 text-[#ff5734]" />
                  <span className="mt-2 font-medium">Générer le quiz</span>
                </button>
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-[#ff5734]" />
                  <p className="mt-2 text-sm text-gray-600">Génération en cours...</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {activeTab === 'course' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateContent('course')}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Générer le cours
                        </>
                      )}
                    </button>
                  </div>

                  {examContent.course_content ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: examContent.course_content }} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun contenu généré</p>
                    </div>
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
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Générer la fiche
                        </>
                      )}
                    </button>
                  </div>

                  {examContent.revision_content ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: examContent.revision_content }} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun contenu généré</p>
                    </div>
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
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Générer le quiz
                        </>
                      )}
                    </button>
                  </div>

                  {examContent.quiz_content ? (
                    <div>
                      {(() => {
                        try {
                          const quizData = JSON.parse(examContent.quiz_content);
                          return <Quiz title={quizData.title} questions={quizData.questions} />;
                        } catch (error) {
                          console.error('Error parsing quiz data:', error);
                          return <div>Erreur lors du chargement du quiz</div>;
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun quiz généré</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'plan' && (
                <RevisionPlan
                  examId={exam.id}
                  examTitle={exam.title}
                  dueDate={exam.due_date}
                  content={examContent.course_content || ''}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
