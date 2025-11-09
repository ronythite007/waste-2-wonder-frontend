import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface Message {
  type: 'user' | 'bot';
  content: string;
}
import { Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: 'Hello! I\'m your Waste2Wonder assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = React.useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    // ensure scroll to bottom for user's message
    setTimeout(() => messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }), 50);

    try {
      // Send message to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: userMessage.content })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.response || "I apologize, but I'm having trouble processing your request."
      }]);
      setIsLoading(false);
      // scroll to bottom to show bot response
      setTimeout(() => messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }), 50);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I apologize, but I'm having technical difficulties. Please try again in a moment."
      }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) handleSendMessage();
    }
  };

  return (
    <div className="relative">
      {/* Chat Icon Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Chat Window */}
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[800px] h-[80vh] flex flex-col animate-fadeIn">
            {/* Header */}
            
<div className="p-6 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
    {/* This inner div groups the Bot icon and the Waste2Wonder text */}
    <div className="flex items-center space-x-3"> 
        <Bot size={32} /> {/* Increased icon size */}
        <h3 className="text-2xl font-bold">Waste2Wonder</h3>
    </div>
    <button
        onClick={() => setIsOpen(false)}
        className="text-white hover:text-green-100 p-2 hover:bg-green-700 rounded-lg transition-colors"
    >
        <X size={24} />
    </button>
</div>

          {/* Messages */}
          {/* <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4" role="log" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg text-base leading-relaxed whitespace-pre-wrap ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {/* Render Markdown properly */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Typing / loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[48%] p-2 rounded-xl bg-gradient-to-r from-white to-gray-100 relative overflow-hidden shadow-sm" style={{ animation: 'bubblePulse 1.8s ease-in-out infinite' }}>
                    {/* shimmer background */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.6), rgba(255,255,255,0.0))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s linear infinite' }} />
                    <div className="relative flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animation: 'bounceDelayed 1s infinite', animationDelay: '0ms' }} />
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animation: 'bounceDelayed 1s infinite', animationDelay: '120ms' }} />
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" style={{ animation: 'bounceDelayed 1s infinite', animationDelay: '240ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

          {/* Input Area */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-base"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}