import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface ExplanationCardProps {
  isCorrect: boolean;
  explanation: string;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ isCorrect, explanation }) => {
  return (
    <div className={`mt-6 p-4 rounded-xl border ${
      isCorrect 
        ? 'bg-green-50 border-green-500' 
        : 'bg-red-50 border-red-500'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="ml-3">
          <h4 className={`text-sm font-medium ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait...'}
          </h4>
          <p className={`mt-1 text-sm ${
            isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExplanationCard;