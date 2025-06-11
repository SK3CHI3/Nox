'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateUsername, isValidUsername } from '@/lib/utils';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
  onBack: () => void;
}

export default function UsernameInput({ onSubmit, onBack }: UsernameInputProps) {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState('');

  useEffect(() => {
    // Generate a suggested username on component mount
    setSuggestedUsername(generateUsername());
  }, []);

  useEffect(() => {
    const valid = isValidUsername(username);
    setIsValid(valid);
    if (username.length > 0 && !valid) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(username);
    }
  };

  const useSuggested = () => {
    setUsername(suggestedUsername);
  };

  const generateNew = () => {
    const newSuggestion = generateUsername();
    setSuggestedUsername(newSuggestion);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse-slow"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-purple rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Back Button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 group glass rounded-2xl px-6 py-3 text-nox-text hover:text-neon-purple transition-all duration-300 border border-white/10 hover:border-neon-purple/40 overflow-hidden"
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative z-10 flex items-center gap-2 font-mono">
          <span className="text-lg">←</span>
          Back
        </span>
      </motion.button>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Title */}
        <motion.div className="mb-8">
          <motion.h1
            className="text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Choose Your Shadow
            {/* Glow effect */}
            <div className="absolute inset-0 text-5xl md:text-6xl font-display font-black blur-xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent opacity-30 -z-10">
              Choose Your Shadow
            </div>
          </motion.h1>

          <motion.p
            className="text-nox-text-dim text-lg font-mono tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Enter a username to begin your anonymous journey
          </motion.p>
        </motion.div>

        {/* Enhanced Username Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full glass rounded-2xl px-8 py-5 text-xl text-nox-text placeholder-nox-text-dim border-2 border-white/20 focus:border-neon-purple/60 focus:outline-none transition-all duration-500 bg-transparent font-mono tracking-wide"
                style={{
                  boxShadow: isValid ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none'
                }}
                maxLength={20}
                autoFocus
              />

              {/* Input glow effect */}
              {isValid && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 blur-xl -z-10"></div>
              )}

              {/* Character counter */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-nox-text-dim font-mono">
                {username.length}/20
              </div>
            </motion.div>

            {showError && (
              <motion.div
                className="mt-3 p-3 glass rounded-xl border border-red-400/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-400 text-sm font-mono">
                  ⚠️ Username must be 3-20 characters, letters, numbers, _ or - only
                </p>
              </motion.div>
            )}
          </div>

          {/* Suggested Username */}
          <div className="space-y-3">
            <p className="text-nox-text-dim text-sm">Or use a suggested username:</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={useSuggested}
                className="flex-1 glass rounded-xl px-4 py-3 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 transition-all duration-300"
              >
                {suggestedUsername}
              </button>
              <button
                type="button"
                onClick={generateNew}
                className="glass rounded-xl px-4 py-3 text-nox-text hover:text-neon-purple border border-white/20 hover:border-neon-purple/30 transition-all duration-300"
                title="Generate new suggestion"
              >
                🎲
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-xl px-6 py-4 text-lg font-semibold transition-all duration-300 ${
              isValid
                ? 'glass border border-neon-cyan/30 hover:border-neon-cyan/60 text-nox-text hover:shadow-neon hover:bg-neon-cyan/10'
                : 'bg-nox-gray border border-nox-light-gray text-nox-text-dim cursor-not-allowed'
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            {isValid ? 'Enter the Shadows' : 'Enter Username'}
          </motion.button>
        </motion.form>

        {/* Info */}
        <motion.div 
          className="mt-8 text-center text-nox-text-dim text-sm space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p>• No registration required</p>
          <p>• Username is temporary and anonymous</p>
          <p>• All data vanishes when you leave</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
