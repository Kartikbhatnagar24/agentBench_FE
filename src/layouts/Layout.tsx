import React from 'react';
import type { UserSession } from '../types/chat';

interface LayoutProps {
  user: UserSession | null;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-text-primary font-sans animate-fade-in">

      {/* ── Top Navigation ── */}
      <header
        className="h-14 px-5 flex items-center justify-between sticky top-0 z-30"
        style={{
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-3 select-none">
          {/* Logo icon */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(129,140,248,0.06) 100%)',
              border: '1px solid rgba(129,140,248,0.25)',
            }}
          >
            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-1.5l1.359-1.359m0 0A3.75 3.75 0 109.75 9.75v.119c0 .085.008.17.025.254l1.085 4.249z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-sm text-text-primary tracking-tight">
              SleekRAG
            </span>
            <span
              className="font-mono text-[9px] text-text-tertiary px-1.5 py-0.5 rounded"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              v0.1
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <nav className="hidden sm:flex items-center gap-1">
              <a
                href="/chat"
                className="px-2.5 py-1.5 rounded-md text-xs text-text-tertiary hover:text-text-primary hover:bg-white/[0.04] transition-colors duration-150"
              >
                Chat
              </a>
              <a
                href="/analysis"
                className="px-2.5 py-1.5 rounded-md text-xs text-text-tertiary hover:text-text-primary hover:bg-white/[0.04] transition-colors duration-150"
              >
                Analysis
              </a>
            </nav>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-1.5 text-text-tertiary hover:text-text-secondary transition-colors duration-150 rounded-md"
            style={{ transition: 'color var(--t-fast)' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>

          {/* Sign out */}
          {user && onLogout && (
            <>
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-state-danger transition-colors duration-150 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-grow flex flex-col relative">
        {children}
      </main>
    </div>
  );
};
