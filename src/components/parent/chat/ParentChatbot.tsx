import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle } from 'lucide-react';
import { generateResponse } from '../../../lib/openai';
import ParentChatMessage from './ParentChatMessage';
import ParentChatSuggestions from './ParentChatSuggestions';
import AILoadingAnimation from '../../ui/AILoadingAnimation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ParentChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant dédié aux parents. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (e instanceof Object) {
      e.preventDefault();
    }
    
    const messageToSend = typeof e === 'string' ? e : inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const prompt = `En tant qu'assistant pour parents d'élèves, réponds à cette question de manière détaillée et bienveillante : ${messageToSend}`;
      const response = await generateResponse(prompt, 'course');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response as string,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full relative">
      {/* Mobile suggestions button */}
      <button
        onClick={() => setShowSuggestions(true)}
        className="fixed top-4 left-4 p-2 rounded-xl bg-white shadow-sm lg:hidden z-50 border border-[#151313]"
      >
        <HelpCircle className="h-6 w-6 text-[#151313]" />
      </button>

      {/* Suggestions panel for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-50 transition-opacity duration-300 ${
          showSuggestions ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowSuggestions(false)}
      >
        <div 
          className={`absolute left-0 top-0 bottom-0 w-80 bg-white transition-transform duration-300 ${
            showSuggestions ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="h-full">
            <ParentChatSuggestions onQuestionClick={(question) => {
              handleSendMessage(question);
              setShowSuggestions(false);
            }} />
          </div>
        </div>
      </div>

      {/* Main chat interface */}
      <div className="flex flex-col h-full bg-white rounded-2xl border border-[#151313]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ParentChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <AILoadingAnimation />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 rounded-xl border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`inline-flex items-center px-4 py-2 border border-[#151313] rounded-xl shadow-sm text-sm font-medium text-white ${
                !inputMessage.trim() || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentChatbot;