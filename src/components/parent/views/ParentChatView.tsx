import React from 'react';
import ParentChatbot from '../chat/ParentChatbot';
import ParentChatSuggestions from '../chat/ParentChatSuggestions';

const ParentChatView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#151313]">Assistant Parent</h2>
          <p className="text-gray-600">
            Posez toutes vos questions sur la scolarité de votre enfant
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Suggestions Panel */}
        <div className="hidden lg:block">
          <ParentChatSuggestions />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <ParentChatbot />
        </div>
      </div>
    </div>
  );
};

export default ParentChatView;