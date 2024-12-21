import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BookOpen, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import AddExamModal from './exams/AddExamModal';
import ExamDetails from './exams/ExamDetails';

interface Exam {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  description: string;
}

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Utilisateur non connecté');
        return;
      }

      const { data, error } = await supabase
        .rpc('get_user_exams', {
          p_user_id: user.id
        });

      if (error) {
        console.error('Error loading exams:', error);
        setError('Erreur lors du chargement des contrôles');
        toast.error('Erreur lors du chargement des contrôles');
        return;
      }

      setExams(data || []);
    } catch (error) {
      console.error('Error loading exams:', error);
      setError('Erreur lors du chargement des contrôles');
      toast.error('Erreur lors du chargement des contrôles');
    } finally {
      setLoading(false);
    }
  };

  const handleExamAdded = () => {
    loadExams();
    setIsAddModalOpen(false);
  };

  const handleExamDeleted = () => {
    loadExams();
    setSelectedExam(null);
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Mes contrôles</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un contrôle
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardClasses} animate-pulse`}>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const dueDate = new Date(exam.due_date);
            const isUpcoming = isAfter(dueDate, new Date());

            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`${cardClasses} hover:border-[#ff5734] transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-[#151313]">{exam.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{exam.subject}</p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    isUpcoming ? 'bg-[#fccc42]' : 'bg-[#be94f5]'
                  }`}>
                    {isUpcoming ? (
                      <AlertCircle className={`h-5 w-5 ${
                        isUpcoming ? 'text-[#151313]' : 'text-white'
                      }`} />
                    ) : (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(dueDate, 'PPP', { locale: fr })}
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {`${exam.description?.substring(0, 50)}${exam.description?.length > 50 ? '...' : ''}`}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`${cardClasses} text-center py-12`}>
          <Calendar className="mx-auto h-12 w-12 text-[#ff5734]" />
          <h3 className="mt-2 text-sm font-medium text-[#151313]">Aucun contrôle</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter votre premier contrôle.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un contrôle
            </button>
          </div>
        </div>
      )}

      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onExamAdded={handleExamAdded}
      />

      {selectedExam && (
        <ExamDetails
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onUpdate={loadExams}
          onDelete={handleExamDeleted}
        />
      )}
    </div>
  );
};

export default Exams;