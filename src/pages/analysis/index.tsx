import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import type { AnalysisOverview, UserSession } from '../../types/chat';
import type { ToastMessage } from '../../components/common/feedback/Toast';
import { Spinner } from '../../components/common/spinners/Spinner';

interface AnalysisPageProps {
  user: UserSession;
  addToast: (text: string, type: ToastMessage['type']) => void;
}

const formatPercent = (value: number) => `${Math.round((value || 0) * 100)}%`;
const formatScore = (value: number) => (value ? value.toFixed(2) : '0.00');
const formatLatency = (value: number) => `${Math.round(value || 0)} ms`;

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ user, addToast }) => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AnalysisOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    ApiService.getAnalysisOverview(user.id)
      .then((data) => {
        if (isMounted) setOverview(data);
      })
      .catch((err: Error) => addToast(err.message || 'Failed to load analysis.', 'error'))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user.id, addToast]);

  const averageQuality = useMemo(() => {
    if (!overview) return 0;
    const { avg_faithfulness, avg_answer_relevancy, avg_confidence_score } = overview.summary;
    return (avg_faithfulness + avg_answer_relevancy + avg_confidence_score) / 3;
  }, [overview]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-56px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="h-[calc(100vh-56px)] p-3">
        <div className="panel h-full flex items-center justify-center text-sm text-text-tertiary">
          Analysis is unavailable right now.
        </div>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Quality', value: formatPercent(averageQuality), detail: 'Mean of scored dimensions' },
    { label: 'Queries', value: overview.summary.total_queries.toString(), detail: `${overview.summary.total_sessions} sessions tracked` },
    { label: 'Latency', value: formatLatency(overview.summary.avg_latency_ms), detail: 'Average response time' },
    { label: 'Retries', value: formatPercent(overview.summary.retry_rate), detail: 'Queries requiring another pass' },
  ];

  const scoreBars = [
    { label: 'Faithfulness', value: overview.summary.avg_faithfulness },
    { label: 'Relevancy', value: overview.summary.avg_answer_relevancy },
    { label: 'Confidence', value: overview.summary.avg_confidence_score },
  ];

  return (
    <div className="w-full h-[calc(100vh-56px)] overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 p-3 h-full">
        <section className="panel xl:col-span-8 flex flex-col overflow-hidden">
          <div className="panel-divider p-5 flex items-start justify-between gap-4">
            <div>
              <p className="label-mono">Evaluation console</p>
              <h1 className="mt-2 text-xl font-semibold text-text-primary tracking-tight">RAG analysis</h1>
              <p className="mt-1 text-xs text-text-tertiary max-w-2xl">
                Aggregated from stored RAGAS metrics, pipeline confidence, retries, and latency.
              </p>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="btn-ghost flex-shrink-0"
              title="Return to chat"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Chat
            </button>
          </div>

          <div className="scroll-area flex-1 p-4 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {summaryCards.map((card) => (
                <article key={card.label} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 inset-highlight">
                  <p className="label-mono">{card.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-text-primary">{card.value}</p>
                  <p className="mt-1 text-[11px] text-text-tertiary">{card.detail}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <section className="lg:col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <p className="label-mono">Score shape</p>
                  <span className="badge border-accent/20 text-accent bg-accent-dim">avg {formatPercent(averageQuality)}</span>
                </div>
                <div className="mt-5 space-y-4">
                  {scoreBars.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="font-mono text-text-tertiary">{formatScore(item.value)}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.max(0, Math.min(100, item.value * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="label-mono">Status</p>
                <div className="mt-4 space-y-2">
                  {overview.status_breakdown.length ? overview.status_breakdown.map((item) => (
                    <div key={item.status} className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2">
                      <span className="text-xs text-text-secondary capitalize">{item.status}</span>
                      <span className="font-mono text-xs text-text-primary">{item.count}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-text-tertiary">No evaluated messages yet.</p>
                  )}
                </div>
                <div className="mt-4 rounded-lg border border-state-danger/15 bg-state-danger/5 px-3 py-2">
                  <p className="text-[11px] text-text-tertiary">Failure rate</p>
                  <p className="mt-1 font-mono text-sm text-state-danger">{formatPercent(overview.summary.failure_rate)}</p>
                </div>
              </section>
            </div>

            <section className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
              <div className="panel-divider-xs px-4 py-3 flex items-center justify-between">
                <p className="label-mono">Weakest queries</p>
                <span className="text-[10px] text-text-tertiary">Lowest combined quality first</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {overview.weak_queries.length ? overview.weak_queries.map((query) => (
                  <button
                    key={query.message_id}
                    onClick={() => navigate(`/chat/${query.session_id}`)}
                    className="w-full text-left px-4 py-3 hover:bg-white/[0.025] transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-text-primary line-clamp-2">{query.question || 'Untitled query'}</p>
                      <span className="font-mono text-[10px] text-text-tertiary flex-shrink-0">{formatLatency(query.latency_ms)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="badge border-white/[0.08] text-text-tertiary">faith {formatScore(query.faithfulness)}</span>
                      <span className="badge border-white/[0.08] text-text-tertiary">rel {formatScore(query.answer_relevancy)}</span>
                      <span className="badge border-white/[0.08] text-text-tertiary">conf {formatScore(query.confidence_score)}</span>
                      {query.retry_count > 0 && <span className="badge border-state-warning/20 text-state-warning bg-state-warning/5">retry {query.retry_count}</span>}
                    </div>
                  </button>
                )) : (
                  <div className="px-4 py-10 text-center text-xs text-text-tertiary">No query-level metrics have been recorded yet.</div>
                )}
              </div>
            </section>
          </div>
        </section>

        <aside className="panel xl:col-span-4 flex flex-col overflow-hidden">
          <div className="panel-divider p-4">
            <p className="label-mono">Sessions</p>
            <p className="mt-2 text-sm font-medium text-text-primary">Conversation breakdown</p>
          </div>
          <div className="scroll-area flex-1 p-3 space-y-2">
            {overview.session_breakdown.length ? overview.session_breakdown.map((session) => {
              const quality = (session.avg_faithfulness + session.avg_answer_relevancy + session.avg_confidence_score) / 3;
              return (
                <button
                  key={session.session_id}
                  onClick={() => navigate(`/chat/${session.session_id}`)}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left hover:border-accent/25 hover:bg-accent-dim transition-all duration-150"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium text-text-primary line-clamp-2">{session.title}</p>
                    <span className="font-mono text-[10px] text-accent">{formatPercent(quality)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <p className="text-text-tertiary">Queries</p>
                      <p className="mt-1 font-mono text-text-secondary">{session.total_queries}</p>
                    </div>
                    <div>
                      <p className="text-text-tertiary">Latency</p>
                      <p className="mt-1 font-mono text-text-secondary">{formatLatency(session.avg_latency_ms)}</p>
                    </div>
                    <div>
                      <p className="text-text-tertiary">Retries</p>
                      <p className="mt-1 font-mono text-text-secondary">{formatPercent(session.retry_rate)}</p>
                    </div>
                  </div>
                </button>
              );
            }) : (
              <div className="py-12 text-center px-4">
                <div className="sidebar-empty-icon w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125C16.5 3.504 17.004 3 17.625 3h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <p className="text-xs text-text-tertiary">Run a few evaluated chats to populate analysis.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
