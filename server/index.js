const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.111:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Enable CORS for Express
app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.1.111:3000"],
  credentials: true
}));

app.use(express.json());

// In-memory storage (in production, use Redis or a database)
const users = new Map(); // userId -> user object
const chats = new Map(); // chatId -> chat object
const userSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

// Utility functions
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const cleanupUser = (userId) => {
  const user = users.get(userId);
  if (user) {
    // Remove user from all chats
    for (const [chatId, chat] of chats.entries()) {
      chat.participants = chat.participants.filter(p => p.id !== userId);
      if (chat.participants.length === 0) {
        chats.delete(chatId);
      }
    }
    users.delete(userId);
  }
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User connection
  socket.on('user:connect', (user) => {
    users.set(user.id, { ...user, isOnline: true, lastSeen: new Date() });
    userSockets.set(user.id, socket.id);
    socketUsers.set(socket.id, user.id);
    
    console.log('User registered:', user.username);
    
    // Broadcast user online status
    socket.broadcast.emit('user:online', user);
  });

  // User search
  socket.on('user:search', (username) => {
    const foundUsers = Array.from(users.values())
      .filter(user => 
        user.username.toLowerCase().includes(username.toLowerCase()) &&
        user.isOnline &&
        user.id !== socketUsers.get(socket.id)
      )
      .slice(0, 10); // Limit results
    
    socket.emit('user:found', foundUsers);
  });

  // Random user matching
  socket.on('user:random', () => {
    const currentUserId = socketUsers.get(socket.id);
    const availableUsers = Array.from(users.values())
      .filter(user => user.isOnline && user.id !== currentUserId);
    
    if (availableUsers.length > 0) {
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
      socket.emit('user:found', [randomUser]);
    } else {
      socket.emit('user:found', []);
    }
  });

  // Chat creation
  socket.on('chat:create', (chatData) => {
    const chatId = generateId();
    const currentUserId = socketUsers.get(socket.id);
    const currentUser = users.get(currentUserId);
    
    if (!currentUser) return;
    
    const chat = {
      id: chatId,
      type: chatData.type || 'direct',
      participants: [currentUser],
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
      ...chatData
    };
    
    chats.set(chatId, chat);
    socket.join(chatId);
    socket.emit('chat:created', chat);
  });

  // Join chat
  socket.on('chat:join', ({ chatId, otherUserId }) => {
    const currentUserId = socketUsers.get(socket.id);
    const currentUser = users.get(currentUserId);
    
    if (!currentUser) return;
    
    let chat = chats.get(chatId);
    
    // If chat doesn't exist and we have another user, create direct chat
    if (!chat && otherUserId) {
      const otherUser = users.get(otherUserId);
      if (otherUser) {
        chat = {
          id: chatId || generateId(),
          type: 'direct',
          participants: [currentUser, otherUser],
          messages: [],
          createdAt: new Date(),
          lastActivity: new Date(),
          isActive: true
        };
        chats.set(chat.id, chat);
      }
    }
    
    if (chat) {
      // Add user to chat if not already in it
      if (!chat.participants.find(p => p.id === currentUserId)) {
        chat.participants.push(currentUser);
      }
      
      socket.join(chat.id);
      socket.emit('chat:joined', chat);
      
      // Notify other participants
      socket.to(chat.id).emit('user:joined', { chatId: chat.id, user: currentUser });
    }
  });

  // Send message
  socket.on('message:send', (messageData) => {
    const currentUserId = socketUsers.get(socket.id);
    const currentUser = users.get(currentUserId);
    
    if (!currentUser) return;
    
    const message = {
      id: generateId(),
      content: messageData.content,
      senderId: currentUserId,
      senderUsername: currentUser.username,
      timestamp: new Date(),
      isRead: false,
      isRepliedTo: false,
      chatId: messageData.chatId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
    
    const chat = chats.get(messageData.chatId);
    if (chat) {
      chat.messages.push(message);
      chat.lastActivity = new Date();
      
      // Broadcast message to all participants in the chat
      io.to(messageData.chatId).emit('message:receive', message);
    }
  });

  // Message read
  socket.on('message:read', ({ messageId, chatId }) => {
    const chat = chats.get(chatId);
    if (chat) {
      const message = chat.messages.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
        io.to(chatId).emit('message:updated', message);
      }
    }
  });

  // Typing indicators
  socket.on('user:typing', ({ chatId, isTyping }) => {
    const currentUserId = socketUsers.get(socket.id);
    const currentUser = users.get(currentUserId);
    
    if (currentUser) {
      socket.to(chatId).emit('user:typing', {
        userId: currentUserId,
        username: currentUser.username,
        isTyping
      });
    }
  });

  // Leave chat
  socket.on('chat:leave', ({ chatId }) => {
    const currentUserId = socketUsers.get(socket.id);
    socket.leave(chatId);
    
    const chat = chats.get(chatId);
    if (chat) {
      chat.participants = chat.participants.filter(p => p.id !== currentUserId);
      if (chat.participants.length === 0) {
        chats.delete(chatId);
      } else {
        socket.to(chatId).emit('user:left', { chatId, userId: currentUserId });
      }
    }
  });

  // Emergency session burn
  socket.on('session:burn', () => {
    const currentUserId = socketUsers.get(socket.id);
    if (currentUserId) {
      cleanupUser(currentUserId);
      socket.emit('session:burned');
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const userId = socketUsers.get(socket.id);
    if (userId) {
      const user = users.get(userId);
      if (user) {
        user.isOnline = false;
        user.lastSeen = new Date();
        
        // Notify others that user went offline
        socket.broadcast.emit('user:offline', user);
      }
      
      userSockets.delete(userId);
      socketUsers.delete(socket.id);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

// Cleanup expired messages every minute
setInterval(() => {
  const now = new Date();
  for (const [chatId, chat] of chats.entries()) {
    const originalLength = chat.messages.length;
    chat.messages = chat.messages.filter(message => {
      if (message.expiresAt && now > message.expiresAt) {
        // Notify participants that message expired
        io.to(chatId).emit('message:expired', message.id);
        return false;
      }
      return true;
    });
    
    if (chat.messages.length !== originalLength) {
      console.log(`Cleaned up ${originalLength - chat.messages.length} expired messages from chat ${chatId}`);
    }
  }
}, 60000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    users: users.size, 
    chats: chats.size,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 NOX Socket.io server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
