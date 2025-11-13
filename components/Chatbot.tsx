import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { startChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce"></div>
  </div>
);

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      const chatSession = startChatSession();
      setChat(chatSession);
      setMessages([
        { role: 'model', content: "Hi there! I'm your CarboLoom AI assistant. How can I help you on your eco-journey today?" }
      ]);
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 300); 
    } else {
        // Reset state when closed
        setChat(null);
        setMessages([]);
        setUserInput('');
        setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading || !chat) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: newUserMessage.content });
      const modelResponse: ChatMessage = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelResponse]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full h-full sm:h-auto sm:max-h-[80vh] sm:w-96 bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 flex flex-col transition-transform duration-300 transform animate-slide-in-up">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <h3 className="text-lg font-bold text-text flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-primary" />
            CarboLoom AI Assistant
        </h3>
        <button onClick={onClose} className="p-2 text-text-secondary hover:bg-border rounded-full" aria-label="Close chat">
          <XIcon className="h-6 w-6" />
        </button>
      </header>
      
      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-background text-text rounded-bl-lg'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className={`max-w-[80%] px-4 py-2 rounded-2xl bg-background text-text rounded-bl-lg`}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sustainability..."
            className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary resize-none"
            rows={1}
            style={{ maxHeight: '100px' }}
          />
          <button type="submit" disabled={isLoading || userInput.trim() === ''} className="p-2 bg-primary text-white rounded-full transition-colors hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0">
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};