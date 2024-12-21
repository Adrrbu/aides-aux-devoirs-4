import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, QuestionResult } from './types';
import ExplanationCard from './ExplanationCard';

interface ExerciseQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, questionResult: QuestionResult) => void;
  onBack: () => void;
}

const ExerciseQuestion: React.FC<ExerciseQuestionProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onBack,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer || hasSubmitted) return;
    setHasSubmitted(true);
    setShowCorrection(true);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    onAnswer(isCorrect, {
      question: question.question,
      userAnswer: selectedAnswer!,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation
    });
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setShowCorrection(false);
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
        <div className="text-sm font-medium text-[#151313]">
          Question {currentQuestion} sur {totalQuestions}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#151313]">
        <h3 className="text-xl font-semibold text-[#151313] mb-6">{question.question}</h3>
        
        <div className="space-y-4">
          {question.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => !hasSubmitted && setSelectedAnswer(choice.id)}
              disabled={hasSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                showCorrection
                  ? choice.id === question.correctAnswer
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : choice.id === selectedAnswer
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-[#151313] text-[#151313]'
                  : selectedAnswer === choice.id
                  ? 'bg-[#ff5734]/10 border-[#ff5734] text-[#151313]'
                  : 'bg-white border-[#151313] text-[#151313] hover:bg-[#f7f7f5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{choice.text}</span>
                {showCorrection && (
                  <>
                    {choice.id === question.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {choice.id === selectedAnswer && choice.id !== question.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {showCorrection && (
          <ExplanationCard
            isCorrect={selectedAnswer === question.correctAnswer}
            explanation={question.explanation}
          />
        )}

        <div className="mt-8 flex justify-between">
          {!showCorrection ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || hasSubmitted}
              className={`w-full py-3 px-4 rounded-xl text-white border border-[#151313] transition-colors ${
                !selectedAnswer || hasSubmitted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
              }`}
            >
              Valider la réponse
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-white border border-[#151313] bg-[#ff5734] hover:bg-[#ff5734]/80 transition-colors"
            >
              {currentQuestion === totalQuestions ? 'Voir les résultats' : 'Question suivante'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseQuestion;