import React from 'react';

interface AnalysisHeaderProps {
  onBackToChat: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ onBackToChat }) => {
  return (
    <div className="panel-divider p-5 flex items-start justify-between gap-4">
      <div>
        <p className="label-mono">Evaluation Console</p>
        <h1 className="mt-2 text-xl font-semibold text-text-primary tracking-tight">RAG Analysis</h1>
        <p className="mt-1 text-xs text-text-tertiary max-w-2xl">
          Aggregated from stored RAGAS metrics, pipeline confidence, retries, and latency.
        </p>
      </div>
      <button
        onClick={onBackToChat}
        className="btn-ghost flex-shrink-0"
        title="Return to chat"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Chat
      </button>
    </div>
  );
};
