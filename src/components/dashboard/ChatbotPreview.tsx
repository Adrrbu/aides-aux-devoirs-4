import React, { useState } from 'react';
import { MessageSquare, X, ArrowRight } from 'lucide-react';

interface ChatbotPreviewProps {
  onStartChat: () => void;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ onStartChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && showHint && (
        <div className="absolute bottom-2 right-20 flex items-center">
          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#151313] mr-4 relative">
            <button
              onClick={() => setShowHint(false)}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full border border-[#151313] hover:bg-[#f7f7f5]"
            >
              <X className="h-3 w-3 text-[#151313]" />
            </button>
            <p className="text-sm font-medium text-[#151313] whitespace-nowrap">
              Pose toutes tes questions ici !
            </p>
          </div>
          <ArrowRight className="h-6 w-6 text-[#ff5734] animate-bounce-x" />
        </div>
      )}

      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-lg border border-[#151313] w-80">
          <div className="p-4 border-b bg-[#fccc42] rounded-t-2xl flex items-center justify-between">
            <h3 className="font-medium text-[#151313]">Assistant IA</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#fccc42]/80 rounded-full"
            >
              <X className="h-5 w-5 text-[#151313]" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Besoin d'aide ? Je suis là pour répondre à toutes vos questions !
            </p>
            <button
              onClick={onStartChat}
              className="w-full py-2 px-4 bg-[#ff5734] text-white rounded-xl border border-[#151313] hover:bg-[#ff5734]/80 transition-colors"
            >
              Démarrer une conversation
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#ff5734] text-white p-4 rounded-full shadow-lg hover:bg-[#ff5734]/80 transition-colors border border-[#151313]"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatbotPreview;
