import React, { useState } from 'react';
import { Brain, Target, Heart, Clock } from 'lucide-react';
import TestQuestions from './TestQuestions';
import TestResults from './TestResults';
import AIAnalysisLoading from './AIAnalysisLoading';
import RecurrenceModal from './RecurrenceModal';
import { useCareerTest } from '../../hooks/useCareerTest';
import { PERSONALITY_TEST, APTITUDE_TEST, INTERESTS_TEST } from './constants';

const CareerTest: React.FC = () => {
  const {
    currentTest,
    answers,
    results,
    isAnalyzing,
    setCurrentTest,
    handleAnswer,
    handleTestComplete,
    resetTest
  } = useCareerTest();

  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<'personality' | 'aptitude' | 'interests' | null>(null);

  const handleRecurrenceClick = (testType: 'personality' | 'aptitude' | 'interests') => {
    setSelectedTest(testType);
    setShowRecurrenceModal(true);
  };

  if (results) {
    return (
      <TestResults 
        results={results}
        onReset={resetTest}
        testType={currentTest!}
      />
    );
  }

  if (currentTest) {
    const currentTestData = {
      personality: PERSONALITY_TEST,
      aptitude: APTITUDE_TEST,
      interests: INTERESTS_TEST
    }[currentTest];

    return (
      <>
        <TestQuestions
          test={currentTestData}
          answers={answers}
          onAnswer={handleAnswer}
          onSubmit={handleTestComplete}
          onBack={resetTest}
          isAnalyzing={isAnalyzing}
        />
        {isAnalyzing && <AIAnalysisLoading />}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and recurrence button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#151313]">Trouve ta voie</h2>
          <p className="text-gray-600">
            Découvre les métiers qui te correspondent le mieux grâce à nos tests d'orientation complets.
          </p>
        </div>
        <button
          onClick={() => setShowRecurrenceModal(true)}
          className="inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-[#151313] bg-white hover:bg-[#f7f7f5]"
        >
          <Clock className="h-5 w-5 mr-2" />
          Programmer les tests
        </button>
      </div>

      {/* Test cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personality Test */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
          <div className="flex items-center justify-between mb-4">
            <Brain className="h-8 w-8 text-[#ff5734]" />
            <button
              onClick={() => handleRecurrenceClick('personality')}
              className="p-2 text-gray-400 hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5]"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Test de personnalité</h3>
          <p className="text-gray-600 text-sm mb-4">
            Découvre les métiers qui correspondent à ta personnalité selon la méthode RIASEC.
          </p>
          <button
            onClick={() => setCurrentTest('personality')}
            className="w-full py-2 px-4 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/80"
          >
            Commencer le test
          </button>
        </div>

        {/* Aptitude Test */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-[#be94f5]" />
            <button
              onClick={() => handleRecurrenceClick('aptitude')}
              className="p-2 text-gray-400 hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5]"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Test d'aptitudes</h3>
          <p className="text-gray-600 text-sm mb-4">
            Évalue tes compétences dans différents domaines pour identifier tes points forts.
          </p>
          <button
            onClick={() => setCurrentTest('aptitude')}
            className="w-full py-2 px-4 bg-[#be94f5] text-white rounded-xl border border-[#151313] hover:bg-[#be94f5]/80"
          >
            Commencer le test
          </button>
        </div>

        {/* Interests Test */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#151313]">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-8 w-8 text-[#fccc42]" />
            <button
              onClick={() => handleRecurrenceClick('interests')}
              className="p-2 text-gray-400 hover:text-[#ff5734] rounded-full hover:bg-[#f7f7f5]"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-[#151313] mb-2">Centres d'intérêt</h3>
          <p className="text-gray-600 text-sm mb-4">
            Explore les domaines qui te passionnent pour trouver ta voie idéale.
          </p>
          <button
            onClick={() => setCurrentTest('interests')}
            className="w-full py-2 px-4 bg-[#fccc42] text-[#151313] rounded-xl border border-[#151313] hover:bg-[#fccc42]/80"
          >
            Commencer le test
          </button>
        </div>
      </div>

      <RecurrenceModal
        isOpen={showRecurrenceModal}
        onClose={() => setShowRecurrenceModal(false)}
        testType={selectedTest || ''}
      />
    </div>
  );
};

export default CareerTest;