import React, { useEffect, useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (message.type === 'user') {
      loadUserAvatar();
    }
  }, [message.type]);

  const loadUserAvatar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user avatar:', error);
    }
  };

  const handleCopy = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = message.content;
      const textContent = tempDiv.textContent || tempDiv.innerText;
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} mb-6`}>
      <div className={`mb-2 ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`w-8 h-8 rounded-full overflow-hidden border border-[#151313] ${
          message.type === 'user' 
            ? 'bg-[#f7f7f5]'
            : 'bg-[#f7f7f5]'
        } flex items-center justify-center`}>
          {message.type === 'user' ? (
            avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-[#151313]" />
            )
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
        {message.type === 'bot' && !message.isStreaming && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#f7f7f5]"
            title="Copier le message"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[#ff5734]" />
            ) : (
              <Copy className="h-4 w-4 text-[#151313]" />
            )}
          </button>
        )}
        
        <div className="prose max-w-none">
          {message.type === 'user' ? (
            <p className="text-sm text-white m-0">{message.content}</p>
          ) : (
            <div className="text-sm text-[#151313] pr-6" dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>

        {message.isStreaming && (
          <div className="flex items-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-[#ff5734] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

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

export default ChatMessage;