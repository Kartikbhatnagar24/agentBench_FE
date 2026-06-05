import React, { useState } from 'react';
import type { SessionAnalysis } from '../../../types/chat';
import {
  formatPercent,
  formatLatency,
  formatScore,
  getScoreTagClass,
  getRelevancyTagClass,
  getRelevancyTooltip,
} from '../../../utils/Analysis';
import { FormattedMessage } from '../../../components/common/chat/FormattedMessage';

interface SessionBreakdownProps {
  sessions: SessionAnalysis[];
  onSessionClick: (sessionId: string) => void;
}

export const SessionBreakdown: React.FC<SessionBreakdownProps> = ({ sessions, onSessionClick }) => {
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  return (
    <aside className="panel xl:col-span-4 flex flex-col overflow-hidden animate-in">
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
            const isExpanded = !!expandedSessions[session.session_id];

            return (
              <div
                key={session.session_id}
                className={`w-full rounded-xl border p-3 text-left transition-all duration-150 ${
                  isExpanded
                    ? 'border-accent/30 bg-accent-dim'
                    : 'border-white/[0.06] bg-white/[0.025] hover:border-accent/25 hover:bg-accent-dim'
                }`}
              >
                {/* Header section (Clickable to toggle accordion) */}
                <div
                  onClick={() => toggleSession(session.session_id)}
                  className="flex flex-col cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <p className="text-xs font-semibold text-text-primary truncate" title={session.title}>
                        {session.title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionClick(session.session_id);
                        }}
                        className="p-1 rounded text-text-secondary hover:text-accent hover:bg-white/[0.05] transition-colors flex-shrink-0"
                        title="Open Chat Session"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-xs text-accent font-semibold">
                        {formatPercent(quality)}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
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
                </div>

                {/* Collapsible Accordion Body */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                    {session.queries && session.queries.length > 0 ? (
                      session.queries.map((query, index) => (
                        <div
                          key={query.message_id || index}
                          className="text-xs space-y-2 bg-white/[0.015] border border-white/[0.04] rounded-lg p-2.5 hover:bg-white/[0.025] transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[9px] text-text-secondary bg-white/[0.06] px-1.5 py-0.5 rounded">
                              Query #{index + 1}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${
                                query.status === 'success'
                                  ? 'bg-state-success/10 text-state-success border-state-success/20'
                                  : 'bg-state-danger/10 text-state-danger border-state-danger/20'
                              }`}
                            >
                              {query.status}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div>
                              <p className="text-[9px] font-semibold text-accent uppercase tracking-wider">Query</p>
                              <div className="mt-0.5 break-words text-text-primary font-medium">
                                <FormattedMessage text={query.question || 'No question recorded'} showReferences={false} />
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">Response</p>
                              <div className="mt-0.5 break-words leading-relaxed text-text-secondary">
                                <FormattedMessage text={query.answer || 'No response details recorded.'} showReferences={false} />
                              </div>
                            </div>
                          </div>

                          {/* Metrics Footer */}
                          <div className="pt-2 border-t border-white/[0.04] flex flex-wrap gap-1.5">
                            <span className={`badge text-[9.5px] px-2 py-0.5 rounded border normal-case font-mono transition-colors duration-150 ${getScoreTagClass(query.faithfulness)}`}>
                              faith {formatScore(query.faithfulness)}
                            </span>
                            <span
                              className={`badge text-[9.5px] px-2 py-0.5 rounded border normal-case font-mono transition-colors duration-150 ${getRelevancyTagClass(query.answer_relevancy, query.is_summary)}`}
                              title={getRelevancyTooltip(query.is_summary)}
                            >
                              rel {formatScore(query.answer_relevancy)}
                            </span>
                            <span className={`badge text-[9.5px] px-2 py-0.5 rounded border normal-case font-mono transition-colors duration-150 ${getScoreTagClass(query.confidence_score)}`}>
                              conf {formatScore(query.confidence_score)}
                            </span>
                            <span className="badge border-white/[0.12] text-text-secondary text-[9.5px] px-2 py-0.5 bg-white/[0.04] normal-case font-mono font-medium">
                              {formatLatency(query.latency_ms)}
                            </span>
                            {query.retry_count > 0 && (
                              <span className="badge border-state-warning/30 text-state-warning bg-state-warning/10 text-[9.5px] px-2 py-0.5 normal-case font-mono font-semibold">
                                retry {query.retry_count}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-[10px] text-text-secondary font-mono">
                        No detailed query metrics available.
                      </div>
                    )}
                  </div>
                )}
              </div>
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
