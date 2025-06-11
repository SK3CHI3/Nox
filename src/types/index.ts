// User Types
export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
  status?: string;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderUsername: string;
  timestamp: Date;
  isRead: boolean;
  isRepliedTo: boolean;
  expiresAt?: Date;
  chatId: string;
}

// Chat Types
export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface DirectChat extends Chat {
  type: 'direct';
  otherUser: User;
}

export interface GroupChat extends Chat {
  type: 'group';
  name: string;
  description?: string;
  maxParticipants: number;
  isPublic: boolean;
  inviteCode?: string;
  createdBy: string;
}

// Socket Events
export interface SocketEvents {
  // Connection events
  'user:connect': (user: User) => void;
  'user:disconnect': (userId: string) => void;
  'user:typing': (data: { userId: string; chatId: string; isTyping: boolean }) => void;
  'user:status': (data: { userId: string; status: string }) => void;

  // Message events
  'message:send': (message: Omit<Message, 'id' | 'timestamp'>) => void;
  'message:receive': (message: Message) => void;
  'message:read': (data: { messageId: string; userId: string }) => void;
  'message:expire': (messageId: string) => void;

  // Chat events
  'chat:create': (chat: Chat) => void;
  'chat:join': (data: { chatId: string; user: User }) => void;
  'chat:leave': (data: { chatId: string; userId: string }) => void;
  'chat:destroy': (chatId: string) => void;

  // Group events
  'group:create': (group: GroupChat) => void;
  'group:join': (data: { groupId: string; user: User }) => void;
  'group:leave': (data: { groupId: string; userId: string }) => void;
  'group:search': (query: string) => void;
  'group:list': () => void;

  // User search
  'user:search': (username: string) => void;
  'user:found': (users: User[]) => void;
  'user:random': () => void;

  // Emergency cleanup
  'session:burn': () => void;
  'session:cleanup': (userId: string) => void;
}

// UI State Types
export interface AppState {
  currentUser: User | null;
  activeChat: Chat | null;
  chats: Chat[];
  onlineUsers: User[];
  isConnected: boolean;
  isTyping: { [chatId: string]: string[] };
}

// Component Props
export interface ChatInputProps {
  chatId: string;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onRead?: (messageId: string) => void;
}

export interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (data: Partial<GroupChat>) => void;
}

// Configuration
export interface AppConfig {
  messageExpirationTime: number; // in milliseconds
  maxMessageLength: number;
  maxGroupSize: number;
  typingIndicatorTimeout: number;
  connectionTimeout: number;
}
