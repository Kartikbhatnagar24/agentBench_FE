import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import type { ChatSession, UserSession } from '../../types/chat';
import type { ToastMessage } from '../../components/common/feedback/Toast';
import { SidebarPanel } from './components/SidebarPanel';
import { ChatPanel } from './components/ChatPanel';

interface DashboardPageProps {
  user: UserSession;
  onLogout: () => void;
  addToast: (text: string, type: ToastMessage['type']) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, addToast }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);
  
  // Track if the initial redirect on load has been handled
  const initialRedirectDone = useRef(false);

  // Synchronize activeSession with the sessionId URL parameter during render phase
  const [prevSessionId, setPrevSessionId] = useState<string | undefined>(sessionId);
  const [prevSessions, setPrevSessions] = useState<ChatSession[]>(sessions);

  if (sessionId !== prevSessionId || sessions !== prevSessions) {
    setPrevSessionId(sessionId);
    setPrevSessions(sessions);
    const match = sessions.find((s) => s.id === sessionId) || null;
    setActiveSession(match);
  }

  // Fetch all sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await ApiService.getChatSessions(user.id);
        setSessions(data);
      } catch {
        addToast('Failed to retrieve chat sessions.', 'error');
      } finally {
        setIsSessionsLoading(false);
      }
    };
    fetchSessions();
  }, [user.id, addToast]);

  // Auto-redirect from '/' to the first available session (only on initial load)
  useEffect(() => {
    if (!isSessionsLoading && sessions.length > 0 && !sessionId && !initialRedirectDone.current) {
      initialRedirectDone.current = true;
      navigate(`/chat/${sessions[0].id}`, { replace: true });
    }
  }, [sessions, sessionId, isSessionsLoading, navigate]);

  const handleDeleteSession = async (deletedId: string) => {
    try {
      await ApiService.deleteChatSession(deletedId, user.id);
      addToast('Chat session deleted.', 'success');
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== deletedId);
        if (sessionId === deletedId) {
          if (remaining.length > 0) {
            navigate(`/chat/${remaining[0].id}`, { replace: true });
          } else {
            navigate('/chat', { replace: true });
          }
        }
        return remaining;
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addToast(errorMsg || 'Failed to delete chat session.', 'error');
    }
  };

  return (
    <div className="w-full h-[calc(100vh-56px)] flex flex-col">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-3 p-3 h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] overflow-hidden">

        {/* Sidebar: Chat Session List */}
        <SidebarPanel
          user={user}
          sessions={sessions}
          activeSession={activeSession}
          isLoading={isSessionsLoading}
          onSelectSession={(s) => navigate(`/chat/${s.id}`)}
          // onLogout={onLogout}
          onCreateNewSession={() => navigate('/chat')}
          onDeleteSession={handleDeleteSession}
        />

        {/* Main Panel: Full-width Chat */}
        <ChatPanel
          key={activeSession?.id || 'new'}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setSessions={setSessions}
          user={user}
          addToast={addToast}
        />

      </div>
    </div>
  );
};
