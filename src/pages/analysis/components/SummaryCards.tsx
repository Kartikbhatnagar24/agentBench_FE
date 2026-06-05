import React from 'react';
import { formatPercent, formatLatency } from '../../../utils/Analysis';

interface SummaryCardsProps {
  totalQueries: number;
  totalSessions: number;
  avgLatencyMs: number;
  retryRate: number;
  avgQuality: number; // Keep in props for compatibility
  avgFaithfulness: number;
  avgAnswerRelevancy: number;
  avgConfidenceScore: number;
  pipelineScore: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalQueries,
  totalSessions,
  avgLatencyMs,
  retryRate,
  avgFaithfulness,
  avgAnswerRelevancy,
  avgConfidenceScore,
  pipelineScore,
}) => {
  const getScoreColor = (scorePercent: number) => {
    if (scorePercent > 60) return 'text-state-success';
    if (scorePercent >= 40) return 'text-state-warning';
    return 'text-state-danger';
  };

  const getScoreBorderClass = (scorePercent: number) => {
    if (scorePercent > 60) return 'border-state-success/15 hover:border-state-success/30';
    if (scorePercent >= 40) return 'border-state-warning/15 hover:border-state-warning/30';
    return 'border-state-danger/15 hover:border-state-danger/30';
  };

  const getScoreBgColor = (scorePercent: number) => {
    if (scorePercent > 60) return 'bg-state-success';
    if (scorePercent >= 40) return 'bg-state-warning';
    return 'bg-state-danger';
  };

  // Convert decimal quality metrics to 0-100 for consistent rating logic
  const qualityCards = [
    {
      label: 'METO Quality Score',
      value: `${pipelineScore.toFixed(1)}%`,
      detail: 'Overall system rating',
      scorePercent: pipelineScore,
      isHero: true,
    },
    {
      label: 'Faithfulness',
      value: formatPercent(avgFaithfulness),
      detail: 'Factual consistency',
      scorePercent: avgFaithfulness * 100,
      isHero: false,
    },
    {
      label: 'Relevancy',
      value: formatPercent(avgAnswerRelevancy),
      detail: 'Retrieval alignment',
      scorePercent: avgAnswerRelevancy * 100,
      isHero: false,
    },
    {
      label: 'Confidence',
      value: formatPercent(avgConfidenceScore),
      detail: 'Fact-check verification',
      scorePercent: avgConfidenceScore * 100,
      isHero: false,
    },
  ];

  return (
    <div className="space-y-2.5 animate-in">
      {/* 4 Compact Quality Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {qualityCards.map((card) => (
          <article
            key={card.label}
            className={`rounded-xl border p-3.5 flex flex-col justify-between min-h-[96px] transition-all duration-200 relative overflow-hidden group ${
              card.isHero
                ? `${getScoreBorderClass(card.scorePercent)} bg-white/[0.04] shadow-md shadow-black/10`
                : 'border-white/[0.06] bg-white/[0.02]'
            }`}
          >
            {/* Subtle top indicator bar for health status */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2.5px] ${getScoreBgColor(
                card.scorePercent
              )} ${card.isHero ? 'opacity-70' : 'opacity-40'} group-hover:opacity-85 transition-opacity duration-200`}
            />
            <div>
              <p className={`label-mono ${card.isHero ? 'text-text-secondary font-semibold' : 'text-text-tertiary'}`}>
                {card.label}
              </p>
              <p
                className={`mt-2 text-xl font-bold tracking-tight ${getScoreColor(
                  card.scorePercent
                )}`}
              >
                {card.value}
              </p>
            </div>
            <p className="mt-1.5 text-[9.5px] text-text-secondary leading-normal">
              {card.detail}
            </p>
          </article>
        ))}
      </div>

      {/* Sleek Operations Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-3.5 py-2 rounded-xl border border-white/[0.04] bg-white/[0.01] inset-highlight">
        <span className="text-[9px] label-mono text-text-tertiary">Operational Performance</span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary">Queries:</span>
            <span className="font-mono font-medium text-text-primary">{totalQueries}</span>
            <span className="text-[10px] text-text-tertiary">({totalSessions} sessions)</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/[0.06] pl-8">
            <span className="text-text-secondary">Avg Latency:</span>
            <span className="font-mono font-medium text-text-primary">{formatLatency(avgLatencyMs)}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/[0.06] pl-8">
            <span className="text-text-secondary">Retry Rate:</span>
            <span className="font-mono font-medium text-text-primary">{formatPercent(retryRate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
