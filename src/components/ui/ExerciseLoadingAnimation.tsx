import React from 'react';
import { Brain, BookOpen, Target } from 'lucide-react';

const ExerciseLoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl border border-[#151313]">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping">
              <Brain className="h-12 w-12 text-[#ff5734]/20" />
            </div>
            <Brain className="h-12 w-12 text-[#ff5734] animate-pulse relative z-10" />
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[#151313] mb-2">
            Génération de l'exercice...
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Je crée un exercice adapté à votre niveau
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <BookOpen className="h-6 w-6 text-[#be94f5] mb-2" />
              <span className="text-xs text-gray-500">Analyse</span>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="h-6 w-6 text-[#fccc42] mb-2" />
              <span className="text-xs text-gray-500">Adaptation</span>
            </div>
            <div className="flex flex-col items-center">
              <Target className="h-6 w-6 text-[#ff5734] mb-2" />
              <span className="text-xs text-gray-500">Génération</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLoadingAnimation;