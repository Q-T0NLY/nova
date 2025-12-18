/**
 * 🎯 Advanced Chatbox Implementation Example
 * 
 * This file demonstrates a complete production-ready implementation
 * of the chatbox design system with all features integrated.
 */

import React, { useState, useEffect, useCallback } from 'react';
import ChatboxDesign from './components/ChatboxDesign';
import { useChat, useTheme, useWebSocket } from './hooks/useChat';
import type {
  ChatMessage,
  ChatSession,
  ThemeColors,
  SendMessageRequest
} from './types/chatbox';
import './styles/chatbox.css';

// ==================== 🎨 STYLED COMPONENTS ====================

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text_primary};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${props => props.theme.surface};
  border-right: 2px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.h2`
  margin: 0 0 20px 0;
  color: ${props => props.theme.primary};
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SidebarItem = styled.button`
  background: ${props => props.active ? `${props.theme.primary}30` : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${props => props.theme.text_primary};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  text-align: left;
  
  &:hover {
    background: ${props => props.theme.primary}20;
    border-color: ${props => props.theme.primary};
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border}40;
  flex-wrap: wrap;
`;

const Select = styled.select`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 8px 12px;
  color: ${props => props.theme.text_primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.secondary})` : `transparent`};
  border: ${props => props.primary ? 'none' : `1px solid ${props.theme.border}`};
  border-radius: 6px;
  padding: 8px 16px;
  color: ${props => props.theme.text_primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 10px ${props => props.theme.primary}40;
  }
`;

const StatDisplay = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border}40;
  font-size: 12px;
  color: ${props => props.theme.text_secondary};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  color: ${props => props.theme.primary};
  font-weight: 600;
  font-size: 14px;
`;

// ==================== ⚛️ MAIN CHATBOX APP COMPONENT ====================

interface AdvancedChatboxAppProps {
  apiEndpoint?: string;
  enableWebSocket?: boolean;
  defaultTheme?: 'cyberpunk' | 'matrix' | 'ocean' | 'midnight' | 'sunset';
}

export const AdvancedChatboxApp: React.FC<AdvancedChatboxAppProps> = ({
  apiEndpoint = '/api/chat',
  enableWebSocket = true,
  defaultTheme = 'cyberpunk'
}) => {
  // ==================== STATE MANAGEMENT ====================
  
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0,
    avgResponseTime: 0,
    avgConfidence: 0,
    errorCount: 0
  });

  // ==================== HOOKS ====================

  const {
    currentTheme,
    applyTheme,
    getAvailableThemes,
    getCurrentThemeColors
  } = useTheme(defaultTheme);

  const {
    messages,
    isLoading,
    error,
    sessionId,
    initializeSession,
    sendMessage,
    deleteMessage,
    clearConversation,
    exportConversation
  } = useChat(apiEndpoint);

  const {
    status: wsStatus,
    send: wsSend,
    on: wsOn,
    off: wsOff
  } = useWebSocket(
    apiEndpoint.replace('http', 'ws').replace('/api', '/ws')
  );

  const themeColors = getCurrentThemeColors();

  // ==================== EFFECTS ====================

  // Initialize WebSocket listeners
  useEffect(() => {
    if (enableWebSocket && wsStatus === 'connected') {
      wsOn('message', {
        onMessage: (data) => {
          console.log('WebSocket message:', data);
        },
        onError: () => {
          console.error('WebSocket error');
        }
      });

      return () => wsOff('message');
    }
  }, [enableWebSocket, wsStatus, wsOn, wsOff]);

  // Update stats when messages change
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    const avgConfidence = messages
      .filter(m => m.confidence_score)
      .reduce((acc, m) => acc + (m.confidence_score || 0), 0) / (assistantMessages || 1);

    setStats({
      totalMessages: messages.length,
      avgResponseTime: 0, // Would be calculated from timestamps
      avgConfidence: parseFloat(avgConfidence.toFixed(2)),
      errorCount: messages.filter(m => m.status === 'error').length
    });
  }, [messages]);

  // ==================== EVENT HANDLERS ====================

  const handleThemeChange = useCallback((newTheme: string) => {
    applyTheme(newTheme);
    setTheme(newTheme);
  }, [applyTheme]);

  const handleNewSession = useCallback(async () => {
    try {
      const newSessionId = await initializeSession({
        title: `Chat ${new Date().toLocaleTimeString()}`,
        context: {
          features: ['streaming', 'thinking', 'confidence']
        }
      });
      
      setCurrentSessionId(newSessionId);
      
      const newSession: ChatSession = {
        id: newSessionId,
        title: `Chat ${new Date().toLocaleTimeString()}`,
        messages: [],
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
        pinned: false
      };
      
      setSessions([...sessions, newSession]);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  }, [initializeSession, sessions]);

  const handleExport = useCallback((format: 'json' | 'markdown') => {
    const exported = exportConversation(format);
    if (exported) {
      const blob = new Blob([exported], {
        type: format === 'json' ? 'application/json' : 'text/markdown'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${Date.now()}.${format === 'json' ? 'json' : 'md'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [exportConversation]);

  const handleClearChat = useCallback(() => {
    if (window.confirm('Clear all messages? This cannot be undone.')) {
      clearConversation();
    }
  }, [clearConversation]);

  // ==================== RENDER ====================

  return (
    <AppContainer theme={themeColors}>
      {/* ==================== SIDEBAR ==================== */}
      <Sidebar theme={themeColors}>
        <SidebarHeader theme={themeColors}>Sessions</SidebarHeader>
        
        {sessions.map((session) => (
          <SidebarItem
            key={session.id}
            active={session.id === currentSessionId}
            theme={themeColors}
            onClick={() => setCurrentSessionId(session.id)}
          >
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              {session.title}
            </div>
            <div style={{ fontSize: '10px', color: themeColors.text_secondary }}>
              {session.messages.length} messages
            </div>
          </SidebarItem>
        ))}

        <Button
          primary
          theme={themeColors}
          onClick={handleNewSession}
          style={{ marginTop: '16px' }}
        >
          + New Session
        </Button>

        <div style={{ marginTop: '32px', borderTop: `1px solid ${themeColors.border}`, paddingTop: '16px' }}>
          <SidebarHeader theme={themeColors} style={{ fontSize: '14px' }}>
            Settings
          </SidebarHeader>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>
              Theme
            </label>
            <Select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              theme={themeColors}
            >
              {getAvailableThemes().map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <Button
            theme={themeColors}
            onClick={() => setShowStats(!showStats)}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>

          <Button
            theme={themeColors}
            onClick={() => handleExport('json')}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            📥 Export JSON
          </Button>

          <Button
            theme={themeColors}
            onClick={() => handleExport('markdown')}
            style={{ width: '100%', marginBottom: '8px' }}
          >
            📥 Export MD
          </Button>

          <Button
            theme={themeColors}
            onClick={handleClearChat}
            style={{ width: '100%' }}
          >
            🗑️ Clear Chat
          </Button>
        </div>
      </Sidebar>

      {/* ==================== MAIN CONTENT ==================== */}
      <MainContent>
        {/* Control Panel */}
        <ControlPanel theme={themeColors}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: themeColors.text_secondary }}>
              Status:
            </span>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isLoading ? '#FFA500' : error ? '#FF0000' : '#00FF00',
                animation: isLoading ? 'pulse 1.5s infinite' : 'none'
              }}
            />
          </div>

          {enableWebSocket && (
            <div style={{ fontSize: '12px', color: themeColors.text_secondary }}>
              WebSocket: <span style={{ color: themeColors.primary }}>{wsStatus}</span>
            </div>
          )}
        </ControlPanel>

        {/* Stats Display */}
        {showStats && (
          <StatDisplay theme={themeColors}>
            <StatItem theme={themeColors}>
              <StatValue theme={themeColors}>{stats.totalMessages}</StatValue>
              <span>Total Messages</span>
            </StatItem>
            <StatItem theme={themeColors}>
              <StatValue theme={themeColors}>{stats.avgConfidence.toFixed(2)}</StatValue>
              <span>Avg Confidence</span>
            </StatItem>
            <StatItem theme={themeColors}>
              <StatValue theme={themeColors}>{stats.errorCount}</StatValue>
              <span>Errors</span>
            </StatItem>
          </StatDisplay>
        )}

        {/* Main Chatbox */}
        <ChatboxDesign
          theme={theme}
          apiEndpoint={apiEndpoint}
          enableWebSocket={enableWebSocket}
          onMessageSent={(msg) => {
            console.log('Message sent:', msg);
          }}
          onThemeChange={handleThemeChange}
          onError={(err) => {
            console.error('Chatbox error:', err);
          }}
        />
      </MainContent>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </AppContainer>
  );
};

// ==================== 🚀 SIMPLE CHATBOX WRAPPER ====================

/**
 * Simple wrapper component for quick integration
 */
export const SimpleChatbox: React.FC<{ theme?: string }> = ({ theme = 'cyberpunk' }) => {
  return (
    <ChatboxDesign
      theme={theme}
      apiEndpoint="/api/chat"
      enableWebSocket={true}
    />
  );
};

// ==================== 🎯 STANDALONE CHAT HOOK EXAMPLE ====================

/**
 * Example of using the useChat hook independently
 */
export const ChatHookExample: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    deleteMessage,
    clearConversation
  } = useChat('/api/chat');

  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Chat Hook Example</h2>
      
      <div style={{ marginBottom: '20px', maxHeight: '400px', overflow: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '10px', padding: '10px', background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5', borderRadius: '4px' }}>
            <strong>{msg.role}:</strong> {msg.content}
            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
              {msg.timestamp.toLocaleTimeString()} - {msg.status}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
          Send
        </button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {isLoading && <div style={{ color: 'orange', marginTop: '10px' }}>Loading...</div>}

      <button onClick={clearConversation} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Clear Chat
      </button>
    </div>
  );
};

// ==================== 📤 EXPORTS ====================

export default AdvancedChatboxApp;

export { SimpleChatbox, ChatHookExample };
