'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message, Chat, SocketEvents } from '@/types';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: (user: User) => void;
  disconnect: () => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  searchUsers: (username: string) => void;
  findRandomUser: () => void;
  createGroup: (groupData: any) => void;
  burnSession: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = (user: User) => {
    if (socketRef.current?.connected) {
      return;
    }

    // In development, connect to localhost:3001
    // In production, this would be your deployed socket server
    const socketUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      auth: {
        user: user
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      newSocket.emit('user:connect', user);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message:send', message);
    }
  };

  const joinChat = (chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:join', { chatId });
    }
  };

  const leaveChat = (chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:leave', { chatId });
    }
  };

  const setTyping = (chatId: string, isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user:typing', { chatId, isTyping });
    }
  };

  const searchUsers = (username: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user:search', username);
    }
  };

  const findRandomUser = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user:random');
    }
  };

  const createGroup = (groupData: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('group:create', groupData);
    }
  };

  const burnSession = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('session:burn');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('session:cleanup');
        socketRef.current.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    joinChat,
    leaveChat,
    setTyping,
    searchUsers,
    findRandomUser,
    createGroup,
    burnSession,
  };
};
