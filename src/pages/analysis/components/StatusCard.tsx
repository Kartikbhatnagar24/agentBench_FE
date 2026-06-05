import React from 'react';
import type { StatusBreakdown } from '../../../types/chat';
import { formatPercent } from '../../../utils/Analysis';

interface StatusCardProps {
  statusBreakdown: StatusBreakdown[];
  failureRate: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({ statusBreakdown, failureRate }) => {
  return (
    <section className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="label-mono">Status</p>
      <div className="mt-4 space-y-2">
        {statusBreakdown.length ? (
          statusBreakdown.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2"
            >
              <span className="text-xs text-text-secondary capitalize">{item.status}</span>
              <span className="font-mono text-xs text-text-primary">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-text-secondary">No evaluated messages yet.</p>
        )}
      </div>
      <div className="mt-4 rounded-lg border border-state-danger/15 bg-state-danger/5 px-3 py-2">
        <p className="text-[11px] text-text-secondary">Failure rate</p>
        <p className="mt-1 font-mono text-sm text-state-danger">{formatPercent(failureRate)}</p>
      </div>
    </section>
  );
};
