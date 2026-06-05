import React from 'react';
import type { WeakQuery } from '../../../types/chat';
import { formatLatency, formatScore } from '../../../utils/Analysis';

interface WeakQueriesProps {
  weakQueries: WeakQuery[];
  onQueryClick: (sessionId: string) => void;
}

export const WeakQueries: React.FC<WeakQueriesProps> = ({ weakQueries, onQueryClick }) => {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
      <div className="panel-divider-xs px-4 py-3 flex items-center justify-between">
        <p className="label-mono">Weakest queries</p>
        <span className="text-[10px] text-text-secondary">Lowest combined quality first</span>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {weakQueries.length ? (
          weakQueries.map((query) => (
            <button
              key={query.message_id}
              onClick={() => onQueryClick(query.session_id)}
              className="w-full text-left px-4 py-3 hover:bg-white/[0.025] transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-text-primary line-clamp-2">
                  {query.question || 'Untitled query'}
                </p>
                <span className="font-mono text-[10px] text-text-secondary flex-shrink-0">
                  {formatLatency(query.latency_ms)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge border-white/[0.08] text-text-secondary">
                  faith {formatScore(query.faithfulness)}
                </span>
                <span className="badge border-white/[0.08] text-text-secondary">
                  rel {formatScore(query.answer_relevancy)}
                </span>
                <span className="badge border-white/[0.08] text-text-secondary">
                  conf {formatScore(query.confidence_score)}
                </span>
                {query.retry_count > 0 && (
                  <span className="badge border-state-warning/20 text-state-warning bg-state-warning/5">
                    retry {query.retry_count}
                  </span>
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-xs text-text-secondary">
            No query-level metrics have been recorded yet.
          </div>
        )}
      </div>
    </section>
  );
};
