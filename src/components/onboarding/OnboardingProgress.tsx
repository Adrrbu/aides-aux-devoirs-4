import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep
              ? 'bg-[#ff5734] w-8'
              : index < currentStep
              ? 'bg-[#ff5734]/50 w-2'
              : 'bg-white/50 w-2'
          }`}
        />
      ))}
    </div>
  );
};

export default OnboardingProgress;