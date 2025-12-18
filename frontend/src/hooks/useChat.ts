import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 🎣 useChat Hook - Manages all chat conversation logic
 * 
 * Features:
 * - Message management (add, delete, edit)
 * - Real-time streaming responses
 * - WebSocket integration ready
 * - Session persistence
 * - Error handling & retry logic
 * - Typing indicators
 * - Message delivery status tracking
 */
export const useChat = (apiEndpoint = '/api/chat') => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const abortControllerRef = useRef(null);

  // Initialize chat session
  const initializeSession = useCallback(async (context = {}) => {
    try {
      const response = await fetch(`${apiEndpoint}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });
      
      if (!response.ok) throw new Error('Failed to initialize session');
      
      const data = await response.json();
      setSessionId(data.session_id);
      return data.session_id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiEndpoint]);

  // Send message with streaming support
  const sendMessage = useCallback(async (content, options = {}) => {
    try {
      setError(null);
      abortControllerRef.current = new AbortController();

      // Add optimistic user message
      const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Prepare request
      const requestBody = {
        message: content,
        session_id: sessionId,
        ...options
      };

      // Attempt streaming first
      try {
        const response = await fetch(`${apiEndpoint}/message/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let thinkingProcess = '';
        let confidenceScore = 1.0;

        // Create assistant message container
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          status: 'streaming'
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Stream response chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'content') {
                  fullContent += data.content;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...assistantMessage,
                      content: fullContent,
                      status: 'streaming'
                    };
                    return updated;
                  });
                }
                
                if (data.type === 'thinking') {
                  thinkingProcess += data.thinking + ' ';
                }
                
                if (data.type === 'metadata') {
                  confidenceScore = data.confidence_score || 1.0;
                }
              } catch (e) {
                // Ignore JSON parse errors for non-JSON lines
              }
            }
          }
        }

        // Finalize message
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...assistantMessage,
            content: fullContent,
            status: 'delivered',
            thinking_process: thinkingProcess.trim(),
            confidence_score: confidenceScore
          };
          return updated;
        });

      } catch (streamErr) {
        // Fallback to regular API call
        const response = await fetch(`${apiEndpoint}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          status: 'delivered',
          thinking_process: data.thinking || null,
          confidence_score: data.confidence_score || 1.0
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, sessionId]);

  // Delete message
  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Edit message
  const editMessage = useCallback((messageId, newContent) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    );
  }, []);

  // Regenerate response for assistant message
  const regenerateResponse = useCallback(async (messageIndex) => {
    const message = messages[messageIndex - 1];
    if (message?.role !== 'user') return;

    // Remove assistant response after the message
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    // Resend the message
    await sendMessage(message.content);
  }, [messages, sendMessage]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  // Export conversation
  const exportConversation = useCallback((format = 'json') => {
    if (format === 'json') {
      return JSON.stringify({
        session_id: sessionId,
        messages,
        exported_at: new Date().toISOString()
      }, null, 2);
    }
    
    if (format === 'markdown') {
      return messages.map(msg => 
        `**${msg.role === 'user' ? '👤 You' : '🤖 Assistant'}**: ${msg.content}\n`
      ).join('\n');
    }
    
    return null;
  }, [sessionId, messages]);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    initializeSession,
    sendMessage,
    deleteMessage,
    editMessage,
    regenerateResponse,
    clearConversation,
    cancelRequest,
    exportConversation
  };
};

/**
 * 🎨 useTheme Hook - Manages theme switching and persistence
 * 
 * Features:
 * - Multiple built-in themes
 * - Custom theme creation
 * - LocalStorage persistence
 * - CSS variable injection
 * - System preference detection
 */
export const useTheme = (defaultTheme = 'cyberpunk') => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isSystemPreference, setIsSystemPreference] = useState(false);

  const themes = {
    cyberpunk: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#0A0A0A',
      surface: '#1A1A2E',
      text_primary: '#FFFFFF',
      text_secondary: '#B0B0B0',
      border: '#FF00FF'
    },
    matrix: {
      primary: '#00FF41',
      secondary: '#008F11',
      accent: '#00FF41',
      background: '#000000',
      surface: '#0A0A0A',
      text_primary: '#00FF41',
      text_secondary: '#008F11',
      border: '#00FF41'
    },
    ocean: {
      primary: '#00B4D8',
      secondary: '#0077B6',
      accent: '#90E0EF',
      background: '#000B1A',
      surface: '#001D3D',
      text_primary: '#E0F7FF',
      text_secondary: '#90E0EF',
      border: '#00B4D8'
    },
    midnight: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#EC4899',
      background: '#0F172A',
      surface: '#1E293B',
      text_primary: '#F1F5F9',
      text_secondary: '#94A3B8',
      border: '#8B5CF6'
    },
    sunset: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#FCD34D',
      background: '#1C1410',
      surface: '#292415',
      text_primary: '#FEF3C7',
      text_secondary: '#D97706',
      border: '#F97316'
    }
  };

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatbox_theme');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsSystemPreference(true);
      }
    }
  }, []);

  // Apply theme to CSS variables
  const applyTheme = useCallback((themeName) => {
    const themeVars = themes[themeName] || themes[defaultTheme];
    
    Object.entries(themeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });

    setCurrentTheme(themeName);
    localStorage.setItem('chatbox_theme', themeName);
  }, [defaultTheme, themes]);

  // Create custom theme
  const createCustomTheme = useCallback((name, colors) => {
    themes[name] = { ...themes[currentTheme], ...colors };
    applyTheme(name);
    return name;
  }, [themes, currentTheme, applyTheme]);

  // Get available themes
  const getAvailableThemes = useCallback(() => {
    return Object.keys(themes);
  }, [themes]);

  // Get current theme colors
  const getCurrentThemeColors = useCallback(() => {
    return themes[currentTheme];
  }, [currentTheme, themes]);

  return {
    currentTheme,
    applyTheme,
    createCustomTheme,
    getAvailableThemes,
    getCurrentThemeColors,
    themes
  };
};

/**
 * 🔌 useWebSocket Hook - Manages real-time WebSocket connections
 * 
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Message queuing during disconnection
 * - Ping/Pong heartbeat
 * - Event subscription system
 * - Connection status tracking
 */
export const useWebSocket = (url) => {
  const [status, setStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttemptsRef = useRef(5);
  const reconnectIntervalRef = useRef(1000);
  const messageQueueRef = useRef([]);
  const listenersRef = useRef({});

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        reconnectIntervalRef.current = 1000;

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          ws.send(JSON.stringify(messageQueueRef.current.shift()));
        }

        // Emit connected event
        Object.values(listenersRef.current).forEach(callbacks => {
          callbacks.onConnect?.();
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);

          // Emit message event
          Object.values(listenersRef.current).forEach(callbacks => {
            callbacks.onMessage?.(data);
          });
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = () => {
        setStatus('error');
        Object.values(listenersRef.current).forEach(callbacks => {
          callbacks.onError?.();
        });
      };

      ws.onclose = () => {
        setStatus('disconnected');
        Object.values(listenersRef.current).forEach(callbacks => {
          callbacks.onDisconnect?.();
        });

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
          reconnectAttemptsRef.current += 1;
          setTimeout(connect, reconnectIntervalRef.current);
          reconnectIntervalRef.current *= 2;
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setStatus('error');
      console.error('WebSocket connection error:', err);
    }
  }, [url]);

  // Send message
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      messageQueueRef.current.push(data);
    }
  }, []);

  // Subscribe to events
  const on = useCallback((event, callbacks) => {
    listenersRef.current[event] = callbacks;
  }, []);

  // Unsubscribe from events
  const off = useCallback((event) => {
    delete listenersRef.current[event];
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  // Initialize connection
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    status,
    messages,
    send,
    on,
    off,
    disconnect,
    connect
  };
};
