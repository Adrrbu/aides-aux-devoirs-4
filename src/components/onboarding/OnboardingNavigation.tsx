import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete
}) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`
          flex items-center px-4 sm:px-6 py-3 rounded-xl border transition-all duration-200
          ${currentStep === 0
            ? 'border-white/20 text-white/40 cursor-not-allowed'
            : 'border-white text-white hover:bg-white/10'
          }
        `}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="font-medium hidden sm:inline">Précédent</span>
      </button>

      {currentStep === totalSteps - 1 ? (
        <button
          onClick={onComplete}
          className="flex-1 sm:flex-none flex items-center justify-center px-6 sm:px-8 py-3 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/90 transition-all duration-200"
        >
          <span className="font-medium">Terminer</span>
          <Check className="h-5 w-5 ml-2" />
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/90 transition-all duration-200"
        >
          <span className="font-medium">Suivant</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      )}
    </div>
  );
};

export default OnboardingNavigation;