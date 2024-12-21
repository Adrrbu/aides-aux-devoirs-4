import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { awardQuizReward } from '../services/rewards';
import toast from 'react-hot-toast';

interface Choice {
  id: string;
  text: string;
}

interface Question {
  question: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ title, questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = async () => {
    if (!selectedAnswer || hasSubmitted) return;
    
    setHasSubmitted(true);
    setShowExplanation(true);
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question or show results
    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setHasSubmitted(false);
        setShowExplanation(false);
      } else {
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);
        setShowResult(true);
        
        // Award izicoins based on score
        try {
          await awardQuizReward(finalScore);
        } catch (error) {
          console.error('Error awarding quiz reward:', error);
          toast.error('Erreur lors de l\'attribution des points');
        }
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setHasSubmitted(false);
    setShowExplanation(false);
  };

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    let rewardMessage = '';
    
    if (finalScore === 100) rewardMessage = '🎉 +1.00 izicoin';
    else if (finalScore >= 75) rewardMessage = '🌟 +0.75 izicoin';
    else if (finalScore >= 50) rewardMessage = '✨ +0.50 izicoin';
    else if (finalScore >= 25) rewardMessage = '💫 +0.25 izicoin';

    return (
      <div className="space-y-6 bg-white rounded-xl p-6 border border-[#151313]">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#151313] mb-2">Quiz terminé !</h3>
          <p className="text-lg text-gray-600">
            Score: {score} sur {questions.length} ({finalScore}%)
          </p>
          {rewardMessage && (
            <p className="mt-4 text-lg font-medium text-[#ff5734]">
              {rewardMessage}
            </p>
          )}
          <button
            onClick={handleRetry}
            className="mt-6 px-6 py-2 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/80"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 border border-[#151313]">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#151313]">{title}</h3>
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} sur {questions.length}
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-lg text-[#151313]">{question.question}</p>

        <div className="space-y-3">
          {question.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => !hasSubmitted && setSelectedAnswer(choice.id)}
              disabled={hasSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                hasSubmitted
                  ? choice.id === question.correctAnswer
                    ? 'bg-green-50 border-green-500'
                    : choice.id === selectedAnswer
                    ? 'bg-red-50 border-red-500'
                    : 'bg-white border-[#151313]'
                  : selectedAnswer === choice.id
                  ? 'bg-[#ff5734]/10 border-[#ff5734]'
                  : 'bg-white border-[#151313] hover:bg-[#f7f7f5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{choice.text}</span>
                {hasSubmitted && (
                  choice.id === question.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : choice.id === selectedAnswer ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-[#f7f7f5] rounded-xl">
            <p className="text-sm text-[#151313]">{question.explanation}</p>
          </div>
        )}

        <button
          onClick={handleAnswer}
          disabled={!selectedAnswer || hasSubmitted}
          className={`w-full py-3 px-4 rounded-xl text-white border border-[#151313] ${
            !selectedAnswer || hasSubmitted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
          }`}
        >
          {hasSubmitted ? 'Réponse soumise' : 'Valider la réponse'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;