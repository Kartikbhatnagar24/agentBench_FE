import React from 'react';
import type { ChatSession } from '../../../types/chat';

interface ChatHeaderProps {
  activeSession: ChatSession | null;
  indexedDocsCount: number;
  showDocs: boolean;
  onToggleDocs: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeSession,
  indexedDocsCount,
  showDocs,
  onToggleDocs,
}) => {
  return (
    <div className="panel-divider h-12 px-5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Panel icon */}
          <div className="header-icon w-5 h-5 rounded-md flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {activeSession ? 'RAG Assistant' : 'New conversation'}
          </span>
        </div>

        {/* Live status */}
        {activeSession && (
          <div className="flex items-center gap-1.5">
            <span className="status-dot-live w-1.5 h-1.5 rounded-full inline-block animate-pulse-soft" />
            <span className="font-mono text-[10px] text-text-tertiary">Connected</span>
          </div>
        )}
      </div>

      {/* Indexed docs toggle */}
      {activeSession && (
        <button
          onClick={onToggleDocs}
          className={`btn-ghost ${showDocs ? 'active' : ''}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <span>{indexedDocsCount} indexed</span>
        </button>
      )}
    </div>
  );
};
