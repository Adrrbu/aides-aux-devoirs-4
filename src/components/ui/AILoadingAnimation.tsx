import React from 'react';
import { Brain } from 'lucide-react';

const AILoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#151313] shadow-sm">
      <div className="relative">
        <Brain className="h-6 w-6 text-[#ff5734] animate-pulse" />
        <div className="absolute inset-0 animate-ping">
          <Brain className="h-6 w-6 text-[#ff5734]/20" />
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default AILoadingAnimation;