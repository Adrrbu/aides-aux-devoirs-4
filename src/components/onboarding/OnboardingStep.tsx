import React from 'react';
import { OnboardingStepType } from './onboardingSteps';

interface OnboardingStepProps {
  step: OnboardingStepType;
  totalSteps: number;
  currentStep: number;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  totalSteps,
  currentStep
}) => {
  const Icon = step.icon;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#151313] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff5734]/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#be94f5]/10 to-transparent rounded-full translate-y-32 -translate-x-32" />

      <div className="relative">
        {/* Step counter */}
        <div className="text-sm text-gray-500 mb-4">
          Étape {currentStep + 1} sur {totalSteps}
        </div>

        {/* Icon */}
        <div 
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: step.color }}
        >
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#151313]">{step.title}</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>

          {/* Features list if present */}
          {step.features && (
            <div className="mt-6 space-y-4">
              {step.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-3"
                    style={{ backgroundColor: step.color + '20' }}
                  >
                    <feature.icon className="h-4 w-4" style={{ color: step.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#151313]">{feature.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep;