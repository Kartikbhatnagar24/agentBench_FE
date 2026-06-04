import { useEffect, useRef, useCallback } from 'react';
import { getApiUrl } from '../services/api/client';
import { type ChatSession, MessageSender } from '../types/chat';

interface UseChatWebSocketProps {
  activeSessionId: string | undefined;
  setActiveSession: React.Dispatch<React.SetStateAction<ChatSession | null>>;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
  onStreamComplete?: () => void;
}

export const useChatWebSocket = ({
  activeSessionId,
  setActiveSession,
  setIsSending,
  onStreamComplete,
}: UseChatWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const connectedSessionId = useRef<string | null>(null);
  // Holds a message to be sent as soon as the socket reaches OPEN
  const pendingMessage = useRef<string | null>(null);

  const connectWebSocket = useCallback((sessionId: string) => {
    // If already connected to the correct session, return it
    if (connectedSessionId.current === sessionId && wsRef.current?.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }
    
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    // Create new WebSocket connection
    const wsUrl = getApiUrl(`/chat/sessions/${sessionId}/ws`).replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    connectedSessionId.current = sessionId;

    ws.onopen = () => {
      // Flush any message that was queued before the socket was ready
      if (pendingMessage.current) {
        ws.send(pendingMessage.current);
        pendingMessage.current = null;
      }
    };

    ws.onmessage = (event) => {
      const data = event.data;
      if (data === '[DONE]') {
        setIsSending(false);
        if (onStreamComplete) {
          onStreamComplete();
        }
      } else {
        setActiveSession((prev) => {
          if (!prev) return prev;
          const newMessages = [...prev.messages];
          const lastMsgIndex = newMessages.length - 1;
          
          // Append streamed chunks to the last message if it is from the assistant
          if (lastMsgIndex >= 0 && newMessages[lastMsgIndex].sender === MessageSender.ASSISTANT) {
            newMessages[lastMsgIndex] = {
              ...newMessages[lastMsgIndex],
              text: newMessages[lastMsgIndex].text + data,
            };
          }
          return { ...prev, messages: newMessages };
        });
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsSending(false);
    };

    ws.onclose = () => {
      if (connectedSessionId.current === sessionId) {
        connectedSessionId.current = null;
      }
      setIsSending(false);
    };

    return ws;
  }, [setIsSending, onStreamComplete, setActiveSession]);

  useEffect(() => {
    if (activeSessionId) {
      connectWebSocket(activeSessionId);
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        connectedSessionId.current = null;
      }
    };
  }, [activeSessionId, connectWebSocket]);

  /**
   * Queue a message to be delivered once the socket for `sessionId` is open.
   * Use this instead of sendViaWebSocket when the connection may still be
   * in CONNECTING state (e.g. immediately after creating a new session).
   */
  const queueMessage = (sessionId: string, text: string) => {
    pendingMessage.current = text;
    const ws = connectWebSocket(sessionId);
    // If it's already open (e.g. reconnect to existing session), send now
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(text);
      pendingMessage.current = null;
    }
    // Otherwise onopen will fire and flush pendingMessage
  };

  return { connectWebSocket, queueMessage, wsRef };
};
