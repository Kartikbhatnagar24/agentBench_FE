import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ChatSession, type UserSession, MessageSender } from '../../../types/chat';
import { ApiService } from '../../../services/api';
import type { DocumentAttachment } from '../../../types/chat';
import type { ToastMessage } from '../../../components/common/feedback/Toast';
import { useChatWebSocket } from '../../../hooks/useChatWebSocket';

import { ChatHeader } from '../../../components/common/chat/ChatHeader';
import { IndexedDocsDrawer } from '../../../components/common/chat/IndexedDocsDrawer';
import { MessageList } from '../../../components/common/chat/MessageList';
import { ChatEmptyState } from '../../../components/common/chat/ChatEmptyState';
import { ChatInputBar } from '../../../components/common/chat/ChatInputBar';

interface ChatPanelProps {
  activeSession: ChatSession | null;
  setActiveSession: React.Dispatch<React.SetStateAction<ChatSession | null>>;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  user: UserSession;
  addToast: (text: string, type: ToastMessage['type']) => void;
  showReferences: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  activeSession,
  setActiveSession,
  setSessions,
  user,
  addToast,
  showReferences,
}) => {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [indexedDocs, setIndexedDocs] = useState<DocumentAttachment[]>([]);
  const [showDocs, setShowDocs] = useState(false);
  const [isDeletingDoc, setIsDeletingDoc] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Scroll to bottom on new messages ───────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isSending]);

  // ── Fetch documents on mount/session changes ─────────────────────────
  useEffect(() => {
    if (activeSession?.id) {
      ApiService.getDocuments(activeSession.id)
        .then(setIndexedDocs)
        .catch(() => {});
    }
  }, [activeSession?.id]);

  // ── Refresh session list after a stream completes ───────────────────────────
  const refreshSessions = async () => {
    try {
      const updated = await ApiService.getChatSessions(user.id);
      setSessions(updated);
      if (activeSession?.id) {
        const found = updated.find((s) => s.id === activeSession.id);
        if (found) setActiveSession(found);
      }
    } catch (err) {
      console.error('Failed to refresh sessions:', err);
    }
  };

  const { connectWebSocket, queueMessage } = useChatWebSocket({
    activeSessionId: activeSession?.id,
    setActiveSession,
    setIsSending,
    onStreamComplete: refreshSessions,
  });

  // ── File attachment ─────────────────────────────────────────────────────────
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const file of files) {
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
        addToast(`"${file.name}" is unsupported — only .txt and .pdf accepted.`, 'error');
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        addToast(`"${file.name}" exceeds the 2 MB limit.`, 'error');
        continue;
      }
      valid.push(file);
    }
    if (valid.length) setAttachedFiles((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeAttachedFile = (idx: number) =>
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));

  const uploadAttachedFiles = async (sessionId: string) => {
    if (!attachedFiles.length) return;
    setIsUploading(true);
    let ok = 0;
    try {
      const results = await Promise.allSettled(
        attachedFiles.map((f) => ApiService.uploadDocument(f, sessionId))
      );
      const uploaded: DocumentAttachment[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') { ok++; uploaded.push(r.value); }
        else addToast(`Upload failed: ${r.reason?.message ?? 'Unknown error'}`, 'error');
      }
      if (ok) {
        addToast(`${ok} file${ok !== 1 ? 's' : ''} indexed.`, 'success');
        setIndexedDocs((prev) => [...prev, ...uploaded]);
      }
    } finally {
      setAttachedFiles([]);
      setIsUploading(false);
    }
  };

  // ── Delete indexed doc ──────────────────────────────────────────────────────
  const handleDeleteDoc = async (docId: string, docName: string) => {
    if (!activeSession) return;
    if (!confirm(`Remove "${docName}" from the RAG index?`)) return;
    setIsDeletingDoc(docId);
    try {
      await ApiService.deleteDocument(docId, activeSession.id);
      setIndexedDocs((prev) => prev.filter((d) => d.id !== docId));
      addToast(`"${docName}" removed from index.`, 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addToast(errorMsg || 'Failed to delete document.', 'error');
    } finally {
      setIsDeletingDoc(null);
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const sendViaWebSocket = (sessionId: string, text: string) => {
    const ws = connectWebSocket(sessionId);
    const send = () => ws.send(text);
    if (ws.readyState === WebSocket.OPEN) send();
    else if (ws.readyState === WebSocket.CONNECTING) ws.addEventListener('open', send, { once: true });
    else { addToast('WebSocket is not connected.', 'error'); setIsSending(false); }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryText = customText !== undefined ? customText.trim() : chatMessage.trim();
    const hasText = queryText.length > 0;
    const hasFiles = attachedFiles.length > 0;
    if ((!hasText && !hasFiles) || isSending || isUploading) return;

    const textToSend = queryText || 'Please analyse the attached document(s) and summarise the key points.';
    setChatMessage('');
    setIsSending(true);

    if (activeSession) {
      await uploadAttachedFiles(activeSession.id);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const optimisticUser = { id: `opt-user-${Date.now()}`, sender: MessageSender.USER, text: textToSend, timestamp: now };
      const optimisticAI   = { id: `opt-ai-${Date.now()}`,   sender: MessageSender.ASSISTANT, text: '', timestamp: now };
      setActiveSession({ ...activeSession, messages: [...activeSession.messages, optimisticUser, optimisticAI] });
      sendViaWebSocket(activeSession.id, textToSend);
    } else {
      try {
        const newSession = await ApiService.createChatSession(user.id, textToSend);
        await uploadAttachedFiles(newSession.id);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const placeholder = {
          ...newSession,
          messages: [...newSession.messages, { id: `opt-ai-${Date.now()}`, sender: MessageSender.ASSISTANT, text: '', timestamp: now }],
        };
        setSessions((prev) => [placeholder, ...prev]);
        setActiveSession(placeholder);
        navigate(`/chat/${newSession.id}`, { replace: true });
        // queueMessage waits for the socket opened by navigate()'s useEffect — no race condition.
        queueMessage(newSession.id, textToSend);
        addToast('Chat started.', 'success');
      } catch {
        addToast('Failed to start chat.', 'error');
        setIsSending(false);
      }
    }
  };

  const canSubmit =
    (chatMessage.trim().length > 0 || attachedFiles.length > 0) && !isSending && !isUploading;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="panel md:col-span-9 flex flex-col overflow-hidden">

      <ChatHeader
        activeSession={activeSession}
        indexedDocsCount={indexedDocs.length}
        showDocs={showDocs}
        onToggleDocs={() => setShowDocs((v) => !v)}
      />

      {showDocs && activeSession && (
        <IndexedDocsDrawer
          docs={indexedDocs}
          isDeletingDoc={isDeletingDoc}
          onDeleteDoc={handleDeleteDoc}
        />
      )}

      {activeSession ? (
        <>
          <MessageList
            messages={activeSession.messages}
            isSending={isSending}
            messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
            showReferences={showReferences}
          />
          <ChatInputBar
            chatMessage={chatMessage}
            attachedFiles={attachedFiles}
            isUploading={isUploading}
            isSending={isSending}
            canSubmit={canSubmit}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            onMessageChange={setChatMessage}
            onFileAttach={handleFileAttach}
            onRemoveFile={removeAttachedFile}
            onSubmit={handleSendMessage}
          />
        </>
      ) : (
        <ChatEmptyState
          chatMessage={chatMessage}
          attachedFiles={attachedFiles}
          isUploading={isUploading}
          isSending={isSending}
          canSubmit={canSubmit}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          onMessageChange={setChatMessage}
          onFileAttach={handleFileAttach}
          onRemoveFile={removeAttachedFile}
          onSubmit={handleSendMessage}
        />
      )}
    </div>
  );
};
