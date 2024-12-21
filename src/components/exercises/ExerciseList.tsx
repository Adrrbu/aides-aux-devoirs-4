import React from 'react';
import { Brain, Trash2 } from 'lucide-react';
import { Exercise } from './types';
import { EmptyState } from '../ui/EmptyState';

interface ExerciseListProps {
  exercises: Exercise[];
  loading: boolean;
  onExerciseStart: (exercise: Exercise) => void;
  onExerciseDelete: (id: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  loading,
  onExerciseStart,
  onExerciseDelete
}) => {
  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${cardClasses} animate-pulse`}>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <EmptyState
        icon={Brain}
        title="Aucun exercice"
        description="Commencez par créer votre premier exercice."
        action={{
          label: "Créer un exercice",
          onClick: () => {}
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map(exercise => (
        <div
          key={exercise.id}
          className={`${cardClasses} hover:border-[#ff5734] transition-colors`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-[#151313]">{exercise.title}</h3>
              <p className="mt-2 text-sm text-gray-500">
                {exercise.subject.name} - Niveau {exercise.difficulty_level?.toUpperCase()}
              </p>
              {exercise.best_score !== null && (
                <div className="mt-2 flex items-center">
                  <div className="bg-[#be94f5] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Meilleur score : {exercise.best_score}%
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => onExerciseDelete(exercise.id)}
              className="text-gray-400 hover:text-[#ff5734]"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => onExerciseStart(exercise)}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff5734] hover:bg-[#ff5734]/80"
          >
            <Brain className="h-5 w-5 mr-2" />
            {exercise.best_score !== null ? 'Réessayer' : 'Commencer'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;