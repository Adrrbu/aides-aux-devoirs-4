import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface ChatbotPreviewProps {
  onStartChat?: () => void;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ onStartChat }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#151313]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-[#ff5734]/10">
          <MessageCircle className="h-5 w-5 text-[#ff5734]" />
        </div>
        <h3 className="text-lg font-medium text-[#151313]">Assistant Parent</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Besoin d'aide ou de conseils ? Je suis là pour répondre à toutes vos questions sur la scolarité de votre enfant.
      </p>

      <button
        onClick={onStartChat}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[#151313] hover:bg-[#f7f7f5] border border-[#151313] transition-colors"
      >
        <span className="font-medium">Démarrer une conversation</span>
        <ArrowRight className="h-5 w-5 text-[#ff5734]" />
      </button>
    </div>
  );
};

export default ChatbotPreview;