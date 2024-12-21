import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, RefreshCw, HelpCircle } from 'lucide-react';
import { generateResponse } from '../lib/openai';
import toast from 'react-hot-toast';
import ChatMessage from './chatbot/ChatMessage';
import SuggestedQuestions from './chatbot/SuggestedQuestions';
import { useSubscription } from '../hooks/useSubscription';
import AILoadingAnimation from './ui/AILoadingAnimation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const MAX_MEMORY = 5;

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour 👋 ! Je suis ton assistant pédagogique. Comment puis-je t\'aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { checkLimit, incrementUsage, usageStats } = useSubscription();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getConversationContext = () => {
    return messages.slice(-MAX_MEMORY)
      .map(msg => `${msg.type === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  };

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (e instanceof Object) {
      e.preventDefault();
    }
    
    const messageToSend = typeof e === 'string' ? e : inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    if (!checkLimit('aiQuestions', usageStats.aiQuestions || 0)) {
      return;
    }

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
      const context = getConversationContext();
      const prompt = `Contexte de la conversation:\n${context}\n\nNouvelle question: ${messageToSend}`;
      
      const response = await generateResponse(prompt, 'course');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response as string,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      await incrementUsage('aiQuestions');
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleRefreshChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'Bonjour 👋 ! Je suis ton assistant pédagogique. Comment puis-je t\'aider aujourd\'hui ?',
      timestamp: new Date()
    }]);
    setInputMessage('');
    toast.success('Nouvelle conversation démarrée');
  };

  const cardClasses = "bg-white rounded-2xl shadow-sm border border-[#151313]";

  return (
    <div className="fixed inset-0 lg:relative lg:h-[calc(100vh-6rem)]">
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-40 ${
          showSuggestions ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowSuggestions(false)}
      />
      
      <div className="flex h-full gap-6">
        {/* Suggestions Panel */}
        <div 
          className={`fixed inset-y-0 left-0 w-80 ${cardClasses} lg:static lg:w-96 transition-transform duration-300 z-50 ${
            showSuggestions ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full p-6">
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <h3 className="text-lg font-semibold text-[#151313]">Questions suggérées</h3>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="p-2 hover:bg-[#f7f7f5] rounded-full"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <SuggestedQuestions onQuestionClick={handleSendMessage} />
          </div>
        </div>

        {/* Chat Interface */}
        <div className={`flex-1 flex flex-col ${cardClasses} ${
          showSuggestions ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="flex items-center p-4 lg:p-6 border-b bg-[#fccc42] rounded-t-2xl">
            <button
              onClick={() => setShowSuggestions(true)}
              className="mr-3 p-2 hover:bg-white/10 rounded-lg lg:hidden"
            >
              <HelpCircle className="h-5 w-5 text-[#151313]" />
            </button>
            <Bot className="h-6 w-6 text-[#151313] mr-2" />
            <div>
              <h2 className="text-lg font-semibold text-[#151313]">Assistant pédagogique</h2>
              <p className="text-sm text-[#151313]/80">Je suis là pour t'aider à apprendre</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-[#f7f7f5]">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <AILoadingAnimation />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and Refresh Button */}
          <div className="border-t bg-white rounded-b-2xl">
            <div className="p-4 lg:p-6">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose ta question..."
                  className="flex-1 rounded-lg border-[#151313] shadow-sm focus:border-[#ff5734] focus:ring-[#ff5734]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    !inputMessage.trim() || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
            <div className="px-4 pb-4 lg:px-6 lg:pb-6 flex justify-center">
              <button
                onClick={handleRefreshChat}
                className="inline-flex items-center px-4 py-2 text-sm text-[#151313] hover:text-[#ff5734]"
                title="Nouvelle conversation"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Nouvelle conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;