import React, { useState, useRef, useEffect } from 'react';
import type { ChatSession, UserSession } from '../../../types/chat';
import { AvatarPanel } from '@/components/common/chat/Avatar';

interface SidebarPanelProps {
  user: UserSession;
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isLoading: boolean;
  onSelectSession: (session: ChatSession) => void;
  onCreateNewSession: () => void;
  onDeleteSession?: (sessionId: string) => void;
  onLogout: () => void;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  user,
  sessions,
  activeSession,
  isLoading,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuRef.current && !menuRef.current.contains(target) && !target.closest('.user-menu-btn')) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <aside className="panel md:col-span-3 flex flex-col overflow-hidden">


      {/* ── New chat button ── */}
      <div className="panel-divider-xs p-3">
        <button
          onClick={onCreateNewSession}
          id="new-chat-btn"
          className="btn-new-chat w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New conversation
        </button>
      </div>

      {/* ── Section label ── */}
      <div className="px-4 py-3">
        <p className="label-mono">Conversations</p>
      </div>

      {/* ── Session list ── */}
      <div className="flex-grow scroll-area px-2 pb-3 space-y-0.5">
        {isLoading ? (
          <div className="p-2 space-y-2">
            {[1, 0.6, 0.3].map((opacity, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-xl" style={{ opacity }} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="sidebar-empty-icon w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <p className="text-xs text-text-tertiary">No conversations yet.</p>
            <p className="text-[10px] text-text-tertiary/60 mt-1">Start one above.</p>
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = activeSession?.id === s.id;
            return (
              <div key={s.id} className="relative group flex items-center animate-fade-in">

                {/* Active accent line */}
                {isActive && (
                  <div className="session-accent-line absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full" />
                )}

                <button
                  onClick={() => onSelectSession(s)}
                  className={`w-full text-left pl-3.5 pr-9 py-3 rounded-xl text-xs transition-all duration-150 ${
                    isActive
                      ? 'session-item-active text-text-primary font-medium'
                      : 'session-item-idle text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <p className="truncate leading-snug">{s.first_message}</p>
                  <p className="font-mono text-[9px] text-text-tertiary mt-1">{s.created_at}</p>
                </button>

                {/* Delete — appears on hover */}
                {onDeleteSession && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this conversation and all its indexed documents?')) {
                        onDeleteSession(s.id);
                      }
                    }}
                    title="Delete conversation"
                    className="btn-delete-session absolute right-1.5 opacity-0 group-hover:opacity-100 p-1.5 text-text-tertiary hover:text-state-danger rounded-lg transition-all duration-150"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* ── User identity ── */}
      <div className="panel-divider p-4 relative">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <AvatarPanel firstName={user.first_name} lastName={user.last_name} />
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-text-primary truncate leading-none">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-[10px] font-mono text-text-tertiary mt-1 truncate" title={user.email}>
              {user.email}
            </p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="user-menu-btn p-1.5 hover:bg-white/[0.05] rounded-lg text-text-tertiary hover:text-text-primary transition-all duration-150 flex-shrink-0"
              title="User options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 bottom-full mb-2 w-32 glass rounded-xl py-1 shadow-float animate-scale-in z-50"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-state-danger hover:bg-white/[0.05] transition-colors duration-150 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
};
