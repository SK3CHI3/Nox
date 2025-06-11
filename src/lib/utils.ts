import { v4 as uuidv4 } from 'uuid';
import { User, Message } from '@/types';

// Generate unique IDs
export const generateId = (): string => uuidv4();

// Generate anonymous usernames
export const generateUsername = (): string => {
  const adjectives = [
    'Shadow', 'Phantom', 'Ghost', 'Void', 'Dark', 'Silent', 'Hidden', 'Mystic',
    'Cyber', 'Neon', 'Digital', 'Binary', 'Quantum', 'Neural', 'Pixel', 'Matrix',
    'Stealth', 'Enigma', 'Cipher', 'Echo', 'Flux', 'Nova', 'Prism', 'Vortex'
  ];
  
  const nouns = [
    'Wolf', 'Raven', 'Falcon', 'Tiger', 'Dragon', 'Phoenix', 'Serpent', 'Panther',
    'Hacker', 'Runner', 'Walker', 'Rider', 'Hunter', 'Seeker', 'Wanderer', 'Guardian',
    'Code', 'Byte', 'Node', 'Link', 'Core', 'Sync', 'Flux', 'Pulse', 'Wave', 'Spark'
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${adjective}${noun}${number}`;
};

// Create anonymous user
export const createAnonymousUser = (username?: string): User => ({
  id: generateId(),
  username: username || generateUsername(),
  isOnline: true,
  lastSeen: new Date(),
});

// Format timestamp for display
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

// Format time for chat messages
export const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Check if message should expire
export const shouldMessageExpire = (message: Message): boolean => {
  if (!message.expiresAt) return false;
  return new Date() > message.expiresAt;
};

// Calculate message expiration time
export const calculateExpirationTime = (baseTime: Date, expirationMinutes: number = 5): Date => {
  const expiration = new Date(baseTime);
  expiration.setMinutes(expiration.getMinutes() + expirationMinutes);
  return expiration;
};

// Sanitize message content
export const sanitizeMessage = (content: string): string => {
  return content
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate username
export const isValidUsername = (username: string): boolean => {
  const trimmed = username.trim();
  return trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
};

// Generate group invite code
export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Debounce function for typing indicators
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for API calls
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Local storage helpers (for temporary session data)
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};

// Session cleanup
export const cleanupSession = (): void => {
  storage.clear();
  // Additional cleanup logic can be added here
};

// Generate neon color based on string
export const getStringColor = (str: string): string => {
  const colors = [
    '#00ffff', // neon-cyan
    '#8b5cf6', // neon-purple  
    '#ec4899', // neon-pink
    '#10b981', // neon-green
    '#3b82f6', // neon-blue
    '#f59e0b', // neon-orange
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
