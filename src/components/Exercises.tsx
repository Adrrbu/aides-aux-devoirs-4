import React, { useState, useEffect } from 'react';
import { Brain, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateResponse } from '../lib/openai';
import toast from 'react-hot-toast';
import ExerciseQuestion from './exercises/ExerciseQuestion';
import ExerciseResult from './exercises/ExerciseResult';
import ExerciseLoadingAnimation from './ui/ExerciseLoadingAnimation';
import { useSubscription } from '../hooks/useSubscription';
import { QuestionResult } from './exercises/types';
import ExerciseFilters from './exercises/ExerciseFilters';
import ExerciseList from './exercises/ExerciseList';
import ExerciseCreationForm from './exercises/ExerciseCreationForm';

interface Exercise {
  id: string;
  title: string;
  subject: {
    id: string;
    name: string;
  };
  difficulty_level: string;
  content: any;
  best_score: number | null;
}

const Exercises: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const { checkLimit, incrementUsage, usageStats } = useSubscription();

  useEffect(() => {
    loadExercises();
  }, [filterSubject, filterLevel]);

  const loadExercises = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('exercises')
        .select(`
          id,
          title,
          difficulty_level,
          content,
          best_score,
          subject:subject_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (filterSubject) {
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', filterSubject)
          .single();
        
        if (subjectData) {
          query = query.eq('subject_id', subjectData.id);
        }
      }
      
      if (filterLevel) {
        query = query.eq('difficulty_level', filterLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
      toast.error('Erreur lors du chargement des exercices');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseGenerated = async (exercise: Exercise) => {
    setExercises(prev => [exercise, ...prev]);
    setView('list');
    toast.success('Exercice généré avec succès');
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setQuestionResults([]);
  };

  const handleAnswer = async (isCorrect: boolean, questionResult: QuestionResult) => {
    if (!currentExercise) return;

    if (isCorrect) {
      setScore(score + 1);
    }
    setQuestionResults(prev => [...prev, questionResult]);

    if (currentQuestionIndex < currentExercise.content.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      const finalScore = Math.round((score + (isCorrect ? 1 : 0)) * 100 / currentExercise.content.questions.length);
      await updateExerciseScore(finalScore);
    }
  };

  const updateExerciseScore = async (finalScore: number) => {
    if (!currentExercise) return;

    try {
      const newBestScore = currentExercise.best_score !== null ? 
        Math.max(currentExercise.best_score, finalScore) : 
        finalScore;

      const { error } = await supabase
        .from('exercises')
        .update({ best_score: newBestScore })
        .eq('id', currentExercise.id);

      if (error) throw error;

      setExercises(exercises.map(ex => 
        ex.id === currentExercise.id ? 
          { ...ex, best_score: newBestScore } : 
          ex
      ));

      setCurrentExercise({
        ...currentExercise,
        best_score: newBestScore
      });
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Erreur lors de la mise à jour du score');
    }
  };

  if (currentExercise) {
    if (showResult) {
      return (
        <ExerciseResult
          score={score}
          totalQuestions={currentExercise.content.questions.length}
          questionResults={questionResults}
          onRetry={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResult(false);
            setQuestionResults([]);
          }}
          onBack={() => {
            setCurrentExercise(null);
            setQuestionResults([]);
          }}
          previousBestScore={currentExercise.best_score}
        />
      );
    }

    const currentQuestion = currentExercise.content.questions[currentQuestionIndex];
    return (
      <ExerciseQuestion
        question={currentQuestion}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={currentExercise.content.questions.length}
        onAnswer={handleAnswer}
        onBack={() => {
          setCurrentExercise(null);
          setQuestionResults([]);
        }}
      />
    );
  }

  if (view === 'create') {
    return (
      <ExerciseCreationForm
        onExerciseGenerated={handleExerciseGenerated}
        onBack={() => setView('list')}
        checkLimit={checkLimit}
        incrementUsage={incrementUsage}
        usageStats={usageStats}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Exercices disponibles</h2>
        <button
          onClick={() => setView('create')}
          className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel exercice
        </button>
      </div>

      <ExerciseFilters
        filterSubject={filterSubject}
        filterLevel={filterLevel}
        onFilterChange={(subject, level) => {
          setFilterSubject(subject);
          setFilterLevel(level);
        }}
      />

      <ExerciseList
        exercises={exercises}
        loading={loading}
        onExerciseStart={startExercise}
        onExerciseDelete={async (id) => {
          try {
            const { error } = await supabase
              .from('exercises')
              .delete()
              .eq('id', id);

            if (error) throw error;
            setExercises(exercises.filter(ex => ex.id !== id));
            toast.success('Exercice supprimé avec succès');
          } catch (error) {
            console.error('Error deleting exercise:', error);
            toast.error('Erreur lors de la suppression de l\'exercice');
          }
        }}
      />
    </div>
  );
};

export default Exercises;