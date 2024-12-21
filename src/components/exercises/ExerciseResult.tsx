import React from 'react';
import { Trophy, RotateCcw, ArrowLeft, Star, CheckCircle, XCircle } from 'lucide-react';
import { QuestionResult } from './types';

interface ExerciseResultProps {
  score: number;
  totalQuestions: number;
  questionResults: QuestionResult[];
  onRetry: () => void;
  onBack: () => void;
  previousBestScore?: number | null;
}

const ExerciseResult: React.FC<ExerciseResultProps> = ({
  score,
  totalQuestions,
  questionResults,
  onRetry,
  onBack,
  previousBestScore,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isNewBest = previousBestScore ? percentage > previousBestScore : true;

  const getFeedback = () => {
    if (percentage === 100) return "Parfait ! Tu as tout bon !";
    if (percentage >= 80) return "Excellent travail !";
    if (percentage >= 60) return "Bien joué ! Continue comme ça !";
    if (percentage >= 40) return "Tu peux faire mieux ! Essaie encore !";
    return "Continue à t'entraîner, tu vas y arriver !";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#151313] flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[#151313] hover:text-[#ff5734]"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux exercices
        </button>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-2xl p-8 border border-[#151313] text-center">
        <div className="flex justify-center mb-6">
          {percentage >= 80 ? (
            <Trophy className="h-16 w-16 text-[#fccc42]" />
          ) : (
            <Star className="h-16 w-16 text-[#be94f5]" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-[#151313] mb-4">{getFeedback()}</h3>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <span className="text-4xl font-bold text-[#ff5734]">{percentage}%</span>
          {isNewBest && (
            <div className="bg-[#ff5734]/10 text-[#ff5734] px-3 py-1 rounded-full text-sm font-medium">
              Nouveau record !
            </div>
          )}
        </div>

        <p className="text-lg text-[#151313] mb-6">
          Tu as obtenu {score} bonnes réponses sur {totalQuestions}
        </p>

        {previousBestScore && (
          <div className="bg-[#f7f7f5] rounded-xl p-4 mb-8">
            <p className="text-[#151313]">
              Meilleur score précédent : {previousBestScore}%
            </p>
            {isNewBest && (
              <p className="text-[#ff5734] font-medium mt-1">
                Tu t'es amélioré de {percentage - previousBestScore}% !
              </p>
            )}
          </div>
        )}

        {/* Questions Review */}
        <div className="mt-8 space-y-6 text-left">
          <h4 className="text-lg font-semibold text-[#151313]">Récapitulatif des réponses</h4>
          {questionResults.map((result, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border ${
                result.isCorrect 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-[#151313]">
                    Question {index + 1}: {result.question}
                  </h5>
                  <p className={`mt-1 text-sm ${
                    result.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Ta réponse : {result.userAnswer}
                  </p>
                  {!result.isCorrect && (
                    <p className="mt-1 text-sm text-[#151313]">
                      Bonne réponse : {result.correctAnswer}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-600">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 border border-[#151313] rounded-xl text-white bg-[#ff5734] hover:bg-[#ff5734]/80 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Réessayer l'exercice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseResult;