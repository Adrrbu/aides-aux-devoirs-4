import React from 'react';
import { Brain } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Votre assistant IA réfléchit..." 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Brain className="h-12 w-12 text-indigo-200" />
            </div>
            <Brain className="h-12 w-12 text-indigo-600 animate-pulse" />
          </div>
          <div className="mt-6 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-lg font-medium text-gray-900">{message}</span>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Je génère un exercice adapté à votre niveau...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;