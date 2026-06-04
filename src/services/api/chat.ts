import type { ChatSession, BackendChatSession } from "../../types/chat";
import { getApiUrl, mapSession, fetchDeduplicated } from "./client";

export const ChatApi = {
  async getChatSessions(userId: string): Promise<ChatSession[]> {
    const res = await fetchDeduplicated(getApiUrl(`/chat/sessions?user_id=${encodeURIComponent(userId)}`));
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to retrieve chat sessions.');
    }

    const list = await res.json();
    const sorted = (list || []).sort((a: BackendChatSession, b: BackendChatSession) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });
    return sorted.map(mapSession);

  },

  async createChatSession(userId: string, firstMessage: string): Promise<ChatSession> {
    const res = await fetch(getApiUrl('/chat/create-session'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        first_message: firstMessage,
        messages: [],
        documents: [],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to initialize chat session.');
    }

    const s = await res.json();
    return mapSession(s);
  },

  async deleteChatSession(sessionId: string, userId: string): Promise<void> {
    const res = await fetch(getApiUrl(`/chat/sessions/${encodeURIComponent(sessionId)}?user_id=${encodeURIComponent(userId)}`), {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to delete chat session.');
    }
  }
};
