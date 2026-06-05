import React from 'react';
import type { SessionAnalysis } from '../../../types/chat';
import { formatPercent, formatLatency } from '../../../utils/Analysis';

interface SessionBreakdownProps {
  sessions: SessionAnalysis[];
  onSessionClick: (sessionId: string) => void;
}

export const SessionBreakdown: React.FC<SessionBreakdownProps> = ({ sessions, onSessionClick }) => {
  return (
    <aside className="panel xl:col-span-4 flex flex-col overflow-hidden">
      <div className="panel-divider p-4">
        <p className="label-mono">Sessions</p>
        <p className="mt-2 text-sm font-medium text-text-primary">Chat breakdown</p>
      </div>
      <div className="scroll-area flex-1 p-3 space-y-2">
        {sessions.length ? (
          sessions.map((session) => {
            const quality =
              (session.avg_faithfulness +
                session.avg_answer_relevancy +
                session.avg_confidence_score) /
              3;
            return (
              <button
                key={session.session_id}
                onClick={() => onSessionClick(session.session_id)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left hover:border-accent/25 hover:bg-accent-dim transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-text-primary line-clamp-2">
                    {session.title}
                  </p>
                  <span className="font-mono text-[10px] text-accent">
                    {formatPercent(quality)}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-text-secondary">Queries</p>
                    <p className="mt-1 font-mono text-text-primary">{session.total_queries}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Latency</p>
                    <p className="mt-1 font-mono text-text-primary">
                      {formatLatency(session.avg_latency_ms)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Retries</p>
                    <p className="mt-1 font-mono text-text-primary">
                      {formatPercent(session.retry_rate)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="py-12 text-center px-4">
            <div className="sidebar-empty-icon w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125C16.5 3.504 17.004 3 17.625 3h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <p className="text-xs text-text-secondary">
              Run a few evaluated chats to populate analysis.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
