'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types';

interface ChatSelectionProps {
  user: User;
  onSearchUser: (username: string) => void;
  onRandomChat: () => void;
  onCreateGroup: () => void;
  onJoinGroup: (code: string) => void;
  onBack: () => void;
}

export default function ChatSelection({ 
  user, 
  onSearchUser, 
  onRandomChat, 
  onCreateGroup, 
  onJoinGroup, 
  onBack 
}: ChatSelectionProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'random' | 'group'>('search');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      onSearchUser(searchUsername.trim());
    }
  };

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupCode.trim()) {
      onJoinGroup(groupCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-nox-black via-nox-dark to-nox-darker"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 glass rounded-xl px-4 py-2 text-nox-text hover:text-neon-cyan transition-colors duration-300 border border-white/10 hover:border-neon-cyan/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      {/* User Info */}
      <motion.div 
        className="absolute top-8 right-8 glass rounded-xl px-4 py-2 border border-white/10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-neon-cyan text-sm">👤 {user.username}</span>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center max-w-2xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Choose Your Path
        </motion.h1>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8 glass rounded-xl p-2 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { id: 'search', label: 'Find User', icon: '🔍' },
            { id: 'random', label: 'Random Chat', icon: '🎲' },
            { id: 'group', label: 'Group Chat', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'text-nox-text hover:text-neon-cyan hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {activeTab === 'search' && (
            <div className="space-y-4">
              <h3 className="text-xl text-nox-text mb-4">Search for a specific user</h3>
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full glass rounded-xl px-6 py-4 text-lg text-nox-text placeholder-nox-text-dim border border-white/20 focus:border-neon-cyan/60 focus:outline-none focus:shadow-neon transition-all duration-300 bg-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!searchUsername.trim()}
                  className={`w-full rounded-xl px-6 py-4 text-lg font-semibold transition-all duration-300 ${
                    searchUsername.trim()
                      ? 'glass border border-neon-cyan/30 hover:border-neon-cyan/60 text-nox-text hover:shadow-neon hover:bg-neon-cyan/10'
                      : 'bg-nox-gray border border-nox-light-gray text-nox-text-dim cursor-not-allowed'
                  }`}
                >
                  🔍 Search User
                </button>
              </form>
            </div>
          )}

          {activeTab === 'random' && (
            <div className="space-y-4">
              <h3 className="text-xl text-nox-text mb-4">Connect with a random user</h3>
              <p className="text-nox-text-dim mb-6">Get matched with someone online for an anonymous conversation</p>
              <button
                onClick={onRandomChat}
                className="w-full glass rounded-xl px-6 py-4 text-lg font-semibold text-nox-text border border-neon-purple/30 hover:border-neon-purple/60 transition-all duration-300 hover:shadow-neon-purple hover:bg-neon-purple/10"
              >
                🎲 Find Random Chat
              </button>
            </div>
          )}

          {activeTab === 'group' && (
            <div className="space-y-6">
              <h3 className="text-xl text-nox-text mb-4">Group Chat Options</h3>
              
              {/* Create Group */}
              <div className="glass rounded-xl p-6 border border-white/10">
                <h4 className="text-lg text-nox-text mb-3">Create New Group</h4>
                <p className="text-nox-text-dim mb-4">Start a new group chat and invite others</p>
                <button
                  onClick={onCreateGroup}
                  className="w-full glass rounded-xl px-6 py-3 text-lg font-semibold text-nox-text border border-neon-pink/30 hover:border-neon-pink/60 transition-all duration-300 hover:shadow-neon-pink hover:bg-neon-pink/10"
                >
                  ➕ Create Group
                </button>
              </div>

              {/* Join Group */}
              <div className="glass rounded-xl p-6 border border-white/10">
                <h4 className="text-lg text-nox-text mb-3">Join Existing Group</h4>
                <p className="text-nox-text-dim mb-4">Enter a group invite code</p>
                <form onSubmit={handleJoinGroup} className="space-y-3">
                  <input
                    type="text"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                    placeholder="Enter group code..."
                    className="w-full glass rounded-xl px-4 py-3 text-lg text-nox-text placeholder-nox-text-dim border border-white/20 focus:border-neon-green/60 focus:outline-none focus:shadow-neon transition-all duration-300 bg-transparent"
                    maxLength={6}
                  />
                  <button
                    type="submit"
                    disabled={!groupCode.trim()}
                    className={`w-full rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300 ${
                      groupCode.trim()
                        ? 'glass border border-neon-green/30 hover:border-neon-green/60 text-nox-text hover:shadow-neon hover:bg-neon-green/10'
                        : 'bg-nox-gray border border-nox-light-gray text-nox-text-dim cursor-not-allowed'
                    }`}
                  >
                    🚪 Join Group
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
