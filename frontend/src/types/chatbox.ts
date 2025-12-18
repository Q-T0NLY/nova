/**
 * 📝 TypeScript Type Definitions for Chatbox Design System
 * 
 * Comprehensive type definitions for all chatbox components,
 * hooks, and utilities. Provides full type safety across the system.
 */

// ==================== 🔤 CHAT MESSAGE TYPES ====================

/**
 * Represents a single message in the conversation
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'streaming' | 'error';
  edited?: boolean;
  deleted?: boolean;
  
  // Optional metadata
  thinking_process?: string;
  confidence_score?: number;
  tokens_used?: number;
  metadata?: Record<string, unknown>;
  
  // Reactions & interactions
  reactions?: MessageReaction[];
  replies?: string[]; // Message IDs
}

/**
 * Represents an emoji reaction to a message
 */
export interface MessageReaction {
  emoji: string;
  users: string[]; // User IDs
  count: number;
}

/**
 * Represents an attachment in a message
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

// ==================== 📋 SESSION TYPES ====================

/**
 * Represents a chat session/conversation
 */
export interface ChatSession {
  id: string;
  title: string;
  description?: string;
  messages: ChatMessage[];
  participants: SessionParticipant[];
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  pinned: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Represents a participant in a chat session
 */
export interface SessionParticipant {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  joinedAt: Date;
  lastSeenAt: Date;
}

/**
 * Options for initializing a new session
 */
export interface SessionInitOptions {
  title?: string;
  context?: Record<string, unknown>;
  participants?: SessionParticipant[];
  systemPrompt?: string;
}

// ==================== 👤 USER TYPES ====================

/**
 * Represents a user in the system
 */
export interface ChatUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  typing?: boolean;
  lastSeen?: Date;
  preferences?: UserPreferences;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  timestamps: boolean;
  autoScroll: boolean;
}

/**
 * Represents online user status
 */
export interface OnlineUser {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  typing?: boolean;
  lastSeen?: Date;
  avatar?: string;
}

// ==================== 🎨 THEME TYPES ====================

/**
 * Complete theme color configuration
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  user_bubble: string;
  assistant_bubble: string;
  system_bubble: string;
  success: string;
  warning: string;
  error: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  shadow?: string;
}

/**
 * Theme configuration with spacing and sizing
 */
export interface Theme extends ThemeColors {
  spacing?: SpacingScale;
  radius?: RadiusScale;
  shadows?: ShadowScale;
  transitions?: TransitionScale;
  fonts?: FontScale;
}

/**
 * Spacing scale configuration
 */
export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Border radius scale
 */
export interface RadiusScale {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * Shadow scale
 */
export interface ShadowScale {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Transition scale
 */
export interface TransitionScale {
  fast: string;
  normal: string;
  slow: string;
}

/**
 * Font scale
 */
export interface FontScale {
  family: string;
  sizes: Record<string, string>;
  weights: Record<string, number>;
}

// ==================== 📤 API REQUEST/RESPONSE TYPES ====================

/**
 * Request body for sending a message
 */
export interface SendMessageRequest {
  message: string;
  session_id?: string;
  context?: Record<string, unknown>;
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

/**
 * Response from message send
 */
export interface SendMessageResponse {
  id: string;
  content: string;
  timestamp: Date;
  status: 'delivered' | 'error';
  tokens_used?: number;
  confidence_score?: number;
}

/**
 * Stream data chunk
 */
export interface StreamChunk {
  type: 'content' | 'thinking' | 'metadata' | 'error';
  content?: string;
  thinking?: string;
  confidence_score?: number;
  tokens_used?: number;
  error?: string;
}

/**
 * Session creation request
 */
export interface CreateSessionRequest {
  title?: string;
  context?: Record<string, unknown>;
  system_prompt?: string;
}

/**
 * Session creation response
 */
export interface CreateSessionResponse {
  session_id: string;
  created_at: Date;
  status: 'active' | 'error';
}

// ==================== 🎣 HOOK RETURN TYPES ====================

/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  initializeSession: (options?: SessionInitOptions) => Promise<string>;
  sendMessage: (content: string, options?: SendMessageRequest) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  regenerateResponse: (messageIndex: number) => Promise<void>;
  clearConversation: () => void;
  cancelRequest: () => void;
  exportConversation: (format: 'json' | 'markdown') => string | null;
}

/**
 * Return type for useTheme hook
 */
export interface UseThemeReturn {
  currentTheme: string;
  applyTheme: (themeName: string) => void;
  createCustomTheme: (name: string, colors: Partial<ThemeColors>) => string;
  getAvailableThemes: () => string[];
  getCurrentThemeColors: () => ThemeColors;
  themes: Record<string, ThemeColors>;
}

/**
 * Return type for useWebSocket hook
 */
export interface UseWebSocketReturn {
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  messages: StreamChunk[];
  send: (data: Record<string, unknown>) => void;
  on: (event: string, callbacks: WebSocketCallbacks) => void;
  off: (event: string) => void;
  disconnect: () => void;
  connect: () => void;
}

/**
 * WebSocket event callbacks
 */
export interface WebSocketCallbacks {
  onConnect?: () => void;
  onMessage?: (data: Record<string, unknown>) => void;
  onError?: (error?: Error) => void;
  onDisconnect?: () => void;
}

// ==================== 🧩 COMPONENT PROP TYPES ====================

/**
 * Props for ChatboxDesign component
 */
export interface ChatboxDesignProps {
  initialSession?: ChatSession;
  theme?: 'cyberpunk' | 'matrix' | 'ocean' | 'midnight' | 'sunset' | string;
  onMessageSent?: (message: ChatMessage) => void;
  onThemeChange?: (theme: string) => void;
  onError?: (error: Error) => void;
  apiEndpoint?: string;
  enableWebSocket?: boolean;
  maxMessages?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  showTypingIndicator?: boolean;
  className?: string;
}

/**
 * Props for Message component
 */
export interface MessageProps {
  message: ChatMessage;
  theme: ThemeColors;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
  onReact?: (id: string, emoji: string) => void;
  onReply?: (id: string) => void;
  showActions?: boolean;
  showAvatar?: boolean;
  className?: string;
}

/**
 * Props for ChatInput component
 */
export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  onAttach?: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  theme: ThemeColors;
  enableFormatting?: boolean;
  enableEmojiPicker?: boolean;
  className?: string;
}

/**
 * Props for ConversationHistory component
 */
export interface ConversationHistoryProps {
  messages: ChatMessage[];
  sessionId: string;
  onLoadMore?: () => Promise<void>;
  onMessageClick?: (message: ChatMessage) => void;
  maxMessages?: number;
  theme: ThemeColors;
  virtualizable?: boolean;
  className?: string;
}

/**
 * Props for UserPresence component
 */
export interface UserPresenceProps {
  users: OnlineUser[];
  currentUserId: string;
  theme: ThemeColors;
  showLastSeen?: boolean;
  showAvatars?: boolean;
  maxVisible?: number;
  className?: string;
}

// ==================== 🔧 UTILITY TYPES ====================

/**
 * Generic async function type
 */
export type AsyncFn<T = void> = () => Promise<T>;

/**
 * Generic callback function type
 */
export type Callback<T = void> = (...args: unknown[]) => T;

/**
 * Debounce options
 */
export interface DebounceOptions {
  wait: number;
  immediate?: boolean;
  maxWait?: number;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Error details
 */
export interface ErrorDetails {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

// ==================== 🗂️ CONTEXT TYPES ====================

/**
 * Chat context for state management
 */
export interface ChatContextType {
  messages: ChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  currentTheme: string;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  setSessionId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: string) => void;
}

// ==================== 📊 ANALYTICS TYPES ====================

/**
 * Chat statistics
 */
export interface ChatStatistics {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  averageMessageLength: number;
  averageResponseTime: number;
  averageConfidenceScore: number;
  sessionDuration: number;
  errorCount: number;
}

/**
 * Message analytics
 */
export interface MessageAnalytics {
  messageId: string;
  timestamp: Date;
  processingTime: number;
  tokensUsed: number;
  confidenceScore: number;
  userRating?: number;
  hasError: boolean;
}

// ==================== 🔐 SECURITY TYPES ====================

/**
 * Authentication token
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Authorization context
 */
export interface AuthContext {
  isAuthenticated: boolean;
  user?: ChatUser;
  token?: AuthToken;
  logout: () => void;
  refreshToken: () => Promise<AuthToken>;
}

// ==================== 🚀 EXPORT ====================

export default {
  ChatMessage,
  ChatSession,
  ChatUser,
  ThemeColors,
  Theme,
  SendMessageRequest,
  SendMessageResponse,
  StreamChunk,
  UseChatReturn,
  UseThemeReturn,
  UseWebSocketReturn,
  ChatboxDesignProps,
  MessageProps,
  ChatInputProps,
  ConversationHistoryProps,
  UserPresenceProps,
  ChatStatistics,
  MessageAnalytics
};
