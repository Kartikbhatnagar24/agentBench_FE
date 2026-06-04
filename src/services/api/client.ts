import type { ChatSession, BackendChatSession, BackendMessage } from "../../types/chat";
import { MessageSender } from "../../types/chat";

// API Base URL config from .env
export const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiUrl = (path: string) => {
  const base = API_PREFIX.startsWith('http') ? API_PREFIX : `http://${API_PREFIX}`;
  return `${base.replace(/\/$/, '')}${path}`;
};

export const STORAGE_KEYS = {
  ACTIVE_USER: 'sleekrag_active_user',
};

// Keep track of active concurrent GET requests to avoid duplicate fetches
const inFlightGetRequests = new Map<string, Promise<Response>>();

export const fetchDeduplicated = async (url: string, options?: RequestInit): Promise<Response> => {
  const method = options?.method || 'GET';
  
  if (method.toUpperCase() !== 'GET') {
    return fetch(url, options);
  }

  const cacheKey = url;
  if (!inFlightGetRequests.has(cacheKey)) {
    const promise = fetch(url, options);
    
    // Once the fetch completes (success or failure), remove it from the cache
    // so future requests fetch fresh data.
    promise.finally(() => {
      inFlightGetRequests.delete(cacheKey);
    });

    inFlightGetRequests.set(cacheKey, promise);
  }

  const res = await inFlightGetRequests.get(cacheKey)!;
  // Clone the response so multiple concurrent callers can read the body stream independently
  return res.clone();
};

// Map backend session representation to frontend model
export const mapSession = (s: BackendChatSession): ChatSession => ({
  id: String(s.id),
  user_id: s.user_id,
  first_message: s.first_message,
  created_at: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  messages: (s.messages || []).map((m: BackendMessage, idx: number) => ({
    id: m.id || `msg-${idx}`,
    sender: m.role === 'user' ? MessageSender.USER : MessageSender.ASSISTANT,
    text: m.content || m.text || '',
    timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })),
});
