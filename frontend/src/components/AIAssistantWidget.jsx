import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ApiService from '../services/api';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Bonjour ! Je suis l\'Assistant IA d\'analyse ML. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automatique en bas de la boîte de dialogue
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ApiService.ai.chat(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '⚠️ Désolé, je suis actuellement incapable de me connecter au supercalculateur ML local. Veuillez réessayer plus tard.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bouton Bulle principale */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out ring-4 ring-indigo-200/50`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Fenêtre de Chat */}
      <div
        className={`${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'} 
          transform origin-bottom-right transition-all duration-300 ease-out 
          w-96 max-w-[90vw] h-[550px] max-h-[85vh] 
          bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden`}
      >
        {/* Header Glassmorphism */}
        <div className="px-5 py-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Copilote ML</h3>
              <p className="text-indigo-300 text-xs flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                En ligne (Llama 3.1)
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-sm'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-slate-800/80 text-slate-200 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[85%] flex space-x-2 items-center">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-xs text-slate-400">Analyse en cours...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="p-4 bg-slate-800/50 border-t border-white/10 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demandez une analyse..."
              className="w-full bg-slate-900/50 text-white text-sm rounded-full pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={16} className={isLoading || !input.trim() ? "opacity-50" : ""} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantWidget;
