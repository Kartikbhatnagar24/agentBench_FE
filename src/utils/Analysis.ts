export const formatPercent = (value: number) => `${Math.round((value || 0) * 100)}%`;
export const formatScore = (value: number) => (value ? value.toFixed(2) : '0.00');
export const formatLatency = (value: number) => `${Math.round(value || 0)} ms`;
