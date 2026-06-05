import React from 'react';
import { formatPercent, formatLatency } from '../../../utils/Analysis';

interface SummaryCardsProps {
  totalQueries: number;
  totalSessions: number;
  avgLatencyMs: number;
  retryRate: number;
  avgQuality: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalQueries,
  totalSessions,
  avgLatencyMs,
  retryRate,
  avgQuality,
}) => {
  const cards = [
    { label: 'Quality', value: formatPercent(avgQuality), detail: 'Mean of scored dimensions' },
    { label: 'Queries', value: totalQueries.toString(), detail: `${totalSessions} sessions tracked` },
    { label: 'Latency', value: formatLatency(avgLatencyMs), detail: 'Average response time' },
    { label: 'Retries', value: formatPercent(retryRate), detail: 'Queries requiring another pass' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 inset-highlight">
          <p className="label-mono">{card.label}</p>
          <p className="mt-3 text-2xl font-semibold text-text-primary">{card.value}</p>
          <p className="mt-1 text-[11px] text-text-secondary">{card.detail}</p>
        </article>
      ))}
    </div>
  );
};
