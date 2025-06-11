'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Message, Chat } from '@/types';
import { formatMessageTime } from '@/lib/utils';

interface ChatInterfaceProps {
  user: User;
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onLeaveChat: () => void;
  onBurnSession: () => void;
  isTyping: string[];
}

export default function ChatInterface({
  user,
  chat,
  messages,
  onSendMessage,
  onLeaveChat,
  onBurnSession,
  isTyping
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
      setIsUserTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Simple typing indicator logic
    if (!isUserTyping && e.target.value.length > 0) {
      setIsUserTyping(true);
      // TODO: Emit typing event to socket
    } else if (isUserTyping && e.target.value.length === 0) {
      setIsUserTyping(false);
      // TODO: Emit stop typing event to socket
    }
  };

  const getChatTitle = () => {
    if (chat.type === 'direct') {
      const otherUser = chat.participants.find(p => p.id !== user.id);
      return otherUser?.username || 'Unknown User';
    } else {
      return (chat as any).name || 'Group Chat';
    }
  };

  const getParticipantCount = () => {
    return chat.participants.length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-nox-black via-nox-dark to-nox-darker">
      {/* Header */}
      <motion.header 
        className="glass border-b border-white/10 p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onLeaveChat}
            className="text-nox-text hover:text-neon-cyan transition-colors duration-300"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-semibold text-nox-text">{getChatTitle()}</h1>
            <p className="text-sm text-nox-text-dim">
              {chat.type === 'group' ? `${getParticipantCount()} participants` : 'Direct chat'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-neon-cyan">👤 {user.username}</span>
          <button
            onClick={onBurnSession}
            className="glass rounded-lg px-3 py-2 text-sm text-red-400 border border-red-400/30 hover:border-red-400/60 hover:bg-red-400/10 transition-all duration-300"
            title="Emergency cleanup - destroys all data immediately"
          >
            🔥 Burn
          </button>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.senderId === user.id
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 text-nox-text'
                    : 'glass border border-white/20 text-nox-text'
                }`}
              >
                {message.senderId !== user.id && (
                  <p className="text-xs text-neon-cyan mb-1">{message.senderUsername}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-nox-text-dim">{formatMessageTime(message.timestamp)}</p>
                  {message.senderId === user.id && (
                    <div className="flex items-center space-x-1">
                      {message.isRead && <span className="text-xs text-neon-green">✓✓</span>}
                      {message.isRepliedTo && <span className="text-xs text-red-400">💥</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicators */}
        {isTyping.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start"
          >
            <div className="glass border border-white/20 px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-nox-text-dim">
                  {isTyping.length === 1 ? `${isTyping[0]} is typing...` : `${isTyping.length} people are typing...`}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div 
        className="glass border-t border-white/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 glass rounded-xl px-4 py-3 text-nox-text placeholder-nox-text-dim border border-white/20 focus:border-neon-cyan/60 focus:outline-none focus:shadow-neon transition-all duration-300 bg-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              messageInput.trim()
                ? 'glass border border-neon-cyan/30 hover:border-neon-cyan/60 text-nox-text hover:shadow-neon hover:bg-neon-cyan/10'
                : 'bg-nox-gray border border-nox-light-gray text-nox-text-dim cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
        
        {/* Message Info */}
        <div className="flex justify-between items-center mt-2 text-xs text-nox-text-dim">
          <span>Messages vanish after being read and replied to</span>
          <span>{messageInput.length}/500</span>
        </div>
      </motion.div>
    </div>
  );
}
