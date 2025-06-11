'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UsernameInput from '@/components/UsernameInput';
import ChatSelection from '@/components/ChatSelection';
import ChatInterface from '@/components/ChatInterface';
import { createAnonymousUser, generateId } from '@/lib/utils';
import { User, Chat, Message } from '@/types';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showChatSelection, setShowChatSelection] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const fullText = "Conversations that vanish like shadows.";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  const handleStartChatting = () => {
    setShowUsernameInput(true);
  };

  const handleUsernameSubmit = (username: string) => {
    const user = createAnonymousUser(username);
    setCurrentUser(user);
    setShowUsernameInput(false);
    setShowChatSelection(true);
  };

  const handleBackToHome = () => {
    setShowUsernameInput(false);
    setShowChatSelection(false);
    setCurrentUser(null);
    setActiveChat(null);
    setMessages([]);
  };

  const handleBackToChatSelection = () => {
    setActiveChat(null);
    setMessages([]);
  };

  // Chat Selection Handlers
  const handleSearchUser = (username: string) => {
    // TODO: Implement user search via socket
    console.log('Searching for user:', username);
    // For demo, create a mock direct chat
    createMockDirectChat(username);
  };

  const handleRandomChat = () => {
    // TODO: Implement random chat matching via socket
    console.log('Finding random chat...');
    // For demo, create a mock direct chat
    createMockDirectChat('RandomUser' + Math.floor(Math.random() * 1000));
  };

  const handleCreateGroup = () => {
    // TODO: Implement group creation via socket
    console.log('Creating group...');
    // For demo, create a mock group chat
    createMockGroupChat();
  };

  const handleJoinGroup = (code: string) => {
    // TODO: Implement group joining via socket
    console.log('Joining group with code:', code);
    // For demo, create a mock group chat
    createMockGroupChat(code);
  };

  // Mock chat creation for demo
  const createMockDirectChat = (otherUsername: string) => {
    if (!currentUser) return;

    const otherUser = createAnonymousUser(otherUsername);
    const chat: Chat = {
      id: generateId(),
      type: 'direct',
      participants: [currentUser, otherUser],
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    setActiveChat(chat);
    setMessages([]);
  };

  const createMockGroupChat = (code?: string) => {
    if (!currentUser) return;

    const chat: Chat = {
      id: generateId(),
      type: 'group',
      participants: [currentUser],
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    // Add group-specific properties
    (chat as any).name = code ? `Group ${code}` : 'New Group';
    (chat as any).inviteCode = code || 'ABC123';

    setActiveChat(chat);
    setMessages([]);
  };

  // Chat Interface Handlers
  const handleSendMessage = (content: string) => {
    if (!currentUser || !activeChat) return;

    const message: Message = {
      id: generateId(),
      content,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      timestamp: new Date(),
      isRead: false,
      isRepliedTo: false,
      chatId: activeChat.id
    };

    setMessages(prev => [...prev, message]);
    // TODO: Send via socket
  };

  const handleLeaveChat = () => {
    setActiveChat(null);
    setMessages([]);
  };

  const handleBurnSession = () => {
    // Emergency cleanup
    setCurrentUser(null);
    setActiveChat(null);
    setMessages([]);
    setShowUsernameInput(false);
    setShowChatSelection(false);
    // TODO: Emit burn session event via socket
    console.log('Session burned!');
  };

  // Show chat interface if user is in an active chat
  if (activeChat && currentUser) {
    return (
      <ChatInterface
        user={currentUser}
        chat={activeChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onLeaveChat={handleLeaveChat}
        onBurnSession={handleBurnSession}
        isTyping={isTyping}
      />
    );
  }

  // Show chat selection if user has been created
  if (showChatSelection && currentUser) {
    return (
      <ChatSelection
        user={currentUser}
        onSearchUser={handleSearchUser}
        onRandomChat={handleRandomChat}
        onCreateGroup={handleCreateGroup}
        onJoinGroup={handleJoinGroup}
        onBack={handleBackToHome}
      />
    );
  }

  // Show username input if user clicked "Start Chatting"
  if (showUsernameInput) {
    return (
      <UsernameInput
        onSubmit={handleUsernameSubmit}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse-slow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* NOX Logo with Enhanced Effects */}
        <motion.div className="relative mb-8">
          <motion.h1
            className="text-8xl md:text-9xl lg:text-[12rem] font-display font-black mb-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            NOX
            {/* Glow effect behind text */}
            <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-display font-black blur-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent opacity-50 -z-10">
              NOX
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-nox-text-dim font-mono tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            ANONYMOUS • EPHEMERAL • ENCRYPTED
          </motion.p>
        </motion.div>

        {/* Typewriter Tagline with Enhanced Styling */}
        <motion.div
          className="mb-16 h-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="glass rounded-2xl px-8 py-4 border border-neon-cyan/20">
            <p className="text-xl md:text-3xl text-nox-text font-mono font-light tracking-wide">
              {displayText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-neon-cyan ml-1 animate-pulse`}>|</span>
            </p>
          </div>
        </motion.div>

        {/* Enhanced CTA Button */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={handleStartChatting}
            className="group relative glass rounded-3xl px-12 py-6 text-xl font-bold text-nox-text border-2 border-neon-cyan/40 hover:border-neon-cyan/80 transition-all duration-500 overflow-hidden"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(0, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <span className="relative z-10 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              START CHATTING
              <span className="text-2xl">🚀</span>
            </span>
          </motion.button>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {[
            {
              icon: "👤",
              title: "Anonymous",
              description: "No accounts, no personal data. Just pure communication.",
              color: "neon-cyan",
              delay: 0
            },
            {
              icon: "⚡",
              title: "Ephemeral",
              description: "Messages vanish after being read and replied to.",
              color: "neon-purple",
              delay: 0.1
            },
            {
              icon: "🔒",
              title: "Secure",
              description: "Real-time encrypted communication with zero trace.",
              color: "neon-pink",
              delay: 0.2
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group glass rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + feature.delay }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Icon with enhanced styling */}
              <motion.div
                className={`text-6xl mb-6 filter drop-shadow-lg`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>

              <h3 className={`text-2xl font-bold mb-4 text-${feature.color} font-display tracking-wide`}>
                {feature.title}
              </h3>

              <p className="text-nox-text-dim text-base leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${feature.color}/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Footer */}
      <motion.footer
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <div className="glass rounded-full px-8 py-3 border border-white/10 inline-block">
          <p className="text-nox-text-dim text-sm font-mono tracking-wider">
            Chat like a shadow • No history • No trace
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
