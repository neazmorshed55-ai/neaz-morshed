"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  budget: string;
  message: string;
}

type ConversationStage = 'greeting' | 'name' | 'email' | 'service' | 'budget' | 'details' | 'complete';

const services = [
  'Virtual Assistant',
  'Lead Generation',
  'Data & CRM Management',
  'Web Development',
  'Video Production',
  'Other'
];

const budgetRanges = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+'
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState<ConversationStage>('greeting');
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: '',
    budget: '',
    message: ''
  });
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage("Hi there! I'm Neaz's AI assistant. I'm here to help you get started with your project. What's your name?");
        setStage('name');
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (content: string, replies?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      if (replies) {
        setQuickReplies(replies);
        setShowQuickReplies(true);
      } else {
        setShowQuickReplies(false);
        setQuickReplies([]);
      }
    }, 800 + Math.random() * 500);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setShowQuickReplies(false);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUserInput = async (input: string) => {
    addUserMessage(input);
    setInputValue('');

    switch (stage) {
      case 'name':
        setLeadData(prev => ({ ...prev, name: input }));
        addBotMessage(`Nice to meet you, ${input}! What's the best email address to reach you?`);
        setStage('email');
        break;

      case 'email':
        if (!validateEmail(input)) {
          addBotMessage("That doesn't look like a valid email. Could you please enter a valid email address?");
          return;
        }
        setLeadData(prev => ({ ...prev, email: input }));
        addBotMessage("Great! What type of service are you interested in?", services);
        setStage('service');
        break;

      case 'service':
        setLeadData(prev => ({ ...prev, serviceInterest: input }));
        addBotMessage("Excellent choice! What's your approximate budget for this project?", budgetRanges);
        setStage('budget');
        break;

      case 'budget':
        setLeadData(prev => ({ ...prev, budget: input }));
        addBotMessage("Perfect! Is there anything specific you'd like to share about your project? (Or type 'skip' to finish)");
        setStage('details');
        break;

      case 'details':
        const finalMessage = input.toLowerCase() === 'skip' ? '' : input;
        const finalLeadData = { ...leadData, message: finalMessage };
        setLeadData(finalLeadData);
        setStage('complete');

        // Submit lead to API
        try {
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...finalLeadData,
              chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
              pageUrl: window.location.href
            }),
          });

          if (response.ok) {
            addBotMessage(`Thank you, ${leadData.name}! I've captured your information and Neaz will get back to you within 12 hours. In the meantime, feel free to explore the portfolio or schedule a call directly!`);
          } else {
            throw new Error('Failed to submit');
          }
        } catch (error) {
          addBotMessage(`Thanks for your interest, ${leadData.name}! There was a small issue saving your details, but you can reach Neaz directly at contact@neazmdmorshed.com.`);
        }
        break;

      case 'complete':
        addBotMessage("Thanks for chatting! If you have more questions, feel free to start a new conversation or reach out directly at contact@neazmdmorshed.com.");
        break;

      default:
        addBotMessage("I'm here to help! Let me know what you're looking for.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleUserInput(inputValue.trim());
  };

  const handleQuickReply = (reply: string) => {
    handleUserInput(reply);
  };

  const resetChat = () => {
    setMessages([]);
    setStage('greeting');
    setLeadData({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceInterest: '',
      budget: '',
      message: ''
    });
    setShowQuickReplies(false);
    setQuickReplies([]);
    setTimeout(() => {
      addBotMessage("Hi there! I'm Neaz's AI assistant. I'm here to help you get started with your project. What's your name?");
      setStage('name');
    }, 500);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-slate-800' : 'bg-gradient-to-br from-[#2ecc71] to-[#27ae60]'
        }`}
        style={{ boxShadow: isOpen ? 'none' : '0 0 30px rgba(46, 204, 113, 0.4)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-[#0b0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Neaz's AI Assistant</h3>
                  <p className="text-white/80 text-sm">Typically replies instantly</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'bot' ? 'bg-[#2ecc71]/20' : 'bg-slate-700'
                  }`}>
                    {message.role === 'bot' ? (
                      <Bot className="w-4 h-4 text-[#2ecc71]" />
                    ) : (
                      <User className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    message.role === 'bot'
                      ? 'bg-slate-800/80 text-slate-200 rounded-tl-sm'
                      : 'bg-[#2ecc71] text-slate-900 rounded-tr-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2ecc71]/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#2ecc71]" />
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <AnimatePresence>
              {showQuickReplies && quickReplies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex flex-wrap gap-2"
                >
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-[#2ecc71]/20 border border-white/10 hover:border-[#2ecc71]/30 rounded-full text-xs text-slate-300 hover:text-[#2ecc71] transition-all"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={stage === 'complete' ? 'Chat ended' : 'Type your message...'}
                  disabled={stage === 'complete' || isTyping}
                  className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2ecc71]/50 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || stage === 'complete'}
                  className="p-3 bg-[#2ecc71] hover:bg-[#27ae60] rounded-xl text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {stage === 'complete' && (
                <button
                  type="button"
                  onClick={resetChat}
                  className="w-full mt-2 text-xs text-[#2ecc71] hover:underline"
                >
                  Start a new conversation
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
