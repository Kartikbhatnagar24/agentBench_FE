import type { DocumentAttachment } from "../../types/chat";
import { getApiUrl, fetchDeduplicated, apiFetch } from "./client";
import { AuthApi } from "./auth";

export const DocumentApi = {
  // Document Upload Service
  async getDocuments(sessionId: string): Promise<DocumentAttachment[]> {
    const active = AuthApi.getActiveSession();
    if (!active) throw new Error('Unauthorized');

    const res = await fetchDeduplicated(
      getApiUrl(`/chat/documents?user_id=${encodeURIComponent(active.id)}&session_id=${encodeURIComponent(sessionId)}`)
    );
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to retrieve document index.');
    }

    return res.json();
  },

  async uploadDocument(file: File, sessionId: string): Promise<DocumentAttachment> {
    const active = AuthApi.getActiveSession();
    if (!active) throw new Error('Unauthorized');

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      throw new Error('Invalid file format. Only plain text (.txt) and PDF (.pdf) files are supported.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await apiFetch(
      getApiUrl(`/chat/upload?user_id=${encodeURIComponent(active.id)}&session_id=${encodeURIComponent(sessionId)}`),
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to upload document.');
    }

    const doc = await res.json();
    return {
      id: String(doc.file_id),
      name: doc.filename,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      content: '',
      uploaded_at: new Date().toString(),
    };
  },

  async deleteDocument(docId: string, sessionId: string): Promise<void> {
    const active = AuthApi.getActiveSession();
    if (!active) throw new Error('Unauthorized');

    const res = await apiFetch(
      getApiUrl(`/chat/documents/${encodeURIComponent(docId)}?user_id=${encodeURIComponent(active.id)}&session_id=${encodeURIComponent(sessionId)}`),
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to delete document.');
    }
  }
};
