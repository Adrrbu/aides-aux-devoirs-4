import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ONBOARDING_STEPS } from '../../lib/onboarding/steps';
import { supabase } from '../../lib/supabase';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('users')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      onClose();
    }
  };

  const handleNext = () => {
    setAnimationDirection('next');
    setCurrentStep(prev => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  };

  const handlePrevious = () => {
    setAnimationDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop avec flou et gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#151313]/80 via-[#151313]/90 to-[#151313]/80 backdrop-blur-md" />
      
      {/* Container du contenu */}
      <div className="min-h-screen px-4 py-8 sm:py-12 relative">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Bouton de fermeture */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Indicateurs de progression */}
          <div className="w-full mb-8">
            <div className="flex items-center justify-center space-x-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-[#ff5734] w-8'
                      : index < currentStep
                      ? 'bg-[#ff5734]/50 w-2'
                      : 'bg-white/20 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Contenu principal */}
          <div 
            className={`w-full mb-20 sm:mb-24 transition-all duration-500 ${
              animationDirection === 'next' 
                ? 'animate-slide-left' 
                : 'animate-slide-right'
            }`}
          >
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 sm:p-12 border border-white/20">
              {/* Icône */}
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-8"
                style={{ backgroundColor: step.color }}
              >
                <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>

              {/* Contenu */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {step.title}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  {step.description}
                </p>

                {/* Liste des fonctionnalités */}
                {step.features && (
                  <div className="mt-8 space-y-4 sm:space-y-0 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-8">
                    {step.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${step.color}20` }}
                        >
                          <feature.icon 
                            className="h-6 w-6 text-white"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-white/70">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
              <button
                onClick={handlePrevious}
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

              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <button
                  onClick={handleClose}
                  className="flex-1 sm:flex-none flex items-center justify-center px-6 sm:px-8 py-3 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/90 transition-all duration-200"
                >
                  <span className="font-medium">Commencer</span>
                  <Check className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/90 transition-all duration-200"
                >
                  <span className="font-medium">Suivant</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;