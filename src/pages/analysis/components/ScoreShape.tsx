import React from 'react';
import { formatPercent, formatScore } from '../../../utils/Analysis';

interface ScoreShapeProps {
  avgFaithfulness: number;
  avgAnswerRelevancy: number;
  avgConfidenceScore: number;
  avgQuality: number;
}

export const ScoreShape: React.FC<ScoreShapeProps> = ({
  avgFaithfulness,
  avgAnswerRelevancy,
  avgConfidenceScore,
  avgQuality,
}) => {
  const scoreBars = [
    { label: 'Faithfulness', value: avgFaithfulness },
    { label: 'Relevancy', value: avgAnswerRelevancy },
    { label: 'Confidence', value: avgConfidenceScore },
  ];

  return (
    <section className="lg:col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-center justify-between">
        <p className="label-mono">Score shape</p>
        <span className="badge border-accent/20 text-accent bg-accent-dim">
          avg {formatPercent(avgQuality)}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {scoreBars.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-mono text-text-secondary">{formatScore(item.value)}</span>
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
  );
};
