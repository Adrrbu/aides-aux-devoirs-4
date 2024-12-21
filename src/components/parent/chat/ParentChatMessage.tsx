import React from 'react';
import { Bot, User } from 'lucide-react';

interface ParentChatMessageProps {
  message: {
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  };
}

const ParentChatMessage: React.FC<ParentChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} mb-6`}>
      <div className={`mb-2 ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`w-8 h-8 rounded-full overflow-hidden border border-[#151313] ${
          message.type === 'user' 
            ? 'bg-[#f7f7f5]'
            : 'bg-[#f7f7f5]'
        } flex items-center justify-center`}>
          {message.type === 'user' ? (
            <User className="h-4 w-4 text-[#151313]" />
          ) : (
            <Bot className="h-4 w-4 text-[#151313]" />
          )}
        </div>
      </div>

      <div 
        className={`max-w-[80%] relative group border border-[#151313] ${
          message.type === 'user'
            ? 'bg-[#ff5734] text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
            : 'bg-white text-[#151313] rounded-tr-xl rounded-bl-xl rounded-br-xl'
        } p-4`}
      >
        <div className="prose max-w-none">
          {message.type === 'user' ? (
            <p className="text-sm text-white m-0">{message.content}</p>
          ) : (
            <div className="text-sm text-[#151313]" dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>

        <span className="text-xs mt-2 block" style={{ 
          color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(21,19,19,0.7)'
        }}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ParentChatMessage;