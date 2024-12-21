import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  category: string;
}

interface TestQuestionsProps {
  test: {
    title: string;
    description: string;
    questions: Question[];
  };
  answers: Record<string, number>;
  onAnswer: (questionId: string, value: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isAnalyzing: boolean;
}

const TestQuestions: React.FC<TestQuestionsProps> = ({
  test,
  answers,
  onAnswer,
  onSubmit,
  onBack,
  isAnalyzing
}) => {
  const isComplete = test.questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[#151313] hover:text-[#ff5734]"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
        <h2 className="text-xl font-bold text-[#151313] mb-2">{test.title}</h2>
        <p className="text-gray-600 mb-6">{test.description}</p>

        <div className="space-y-6">
          {test.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <p className="text-[#151313] font-medium">{question.text}</p>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => onAnswer(question.id, value)}
                    className={`w-10 h-10 rounded-lg border ${
                      answers[question.id] === value
                        ? 'bg-[#ff5734] text-white border-[#ff5734]'
                        : 'border-[#151313] hover:bg-[#f7f7f5]'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={onSubmit}
            disabled={!isComplete || isAnalyzing}
            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-[#151313] rounded-xl text-white ${
              !isComplete || isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser les résultats'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestQuestions;