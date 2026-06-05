export const formatPercent = (value: number) => `${Math.round((value || 0) * 100)}%`;
export const formatScore = (value: number) => (value ? value.toFixed(2) : '0.00');
export const formatLatency = (value: number) => `${Math.round(value || 0)} ms`;

/**
 * Classifies a score into success, warning, or danger based on thresholds.
 * For overall average/chart bars: green > 0.6, amber 0.4-0.6, red < 0.4.
 * For individual queries: green >= 0.8, amber 0.5-0.8, red < 0.5.
 */
export const getScoreStatus = (value: number, isQueryLevel = false): 'success' | 'warning' | 'danger' => {
  const highThreshold = isQueryLevel ? 0.8 : 0.6;
  const lowThreshold = isQueryLevel ? 0.5 : 0.4;
  
  if (value > highThreshold || (isQueryLevel && value >= highThreshold)) return 'success';
  if (value >= lowThreshold) return 'warning';
  return 'danger';
};

/**
 * Returns Tailwind text color classes based on score status.
 */
export const getScoreTextColorClass = (value: number, isQueryLevel = false) => {
  const status = getScoreStatus(value, isQueryLevel);
  return {
    success: 'text-state-success',
    warning: 'text-state-warning',
    danger: 'text-state-danger',
  }[status];
};

/**
 * Returns Tailwind background progress bar color classes based on score status.
 */
export const getScoreBgClass = (value: number, isQueryLevel = false) => {
  const status = getScoreStatus(value, isQueryLevel);
  return {
    success: 'bg-state-success',
    warning: 'bg-state-warning',
    danger: 'bg-state-danger',
  }[status];
};

/**
 * Returns Tailwind styling class for score tags (faith/rel/conf) with soft tint.
 */
export const getScoreTagClass = (value: number) => {
  const status = getScoreStatus(value, true); // query-level thresholds
  return {
    success: 'bg-state-success/6 text-state-success/80 border-state-success/20 font-medium',
    warning: 'bg-state-warning/6 text-state-warning/80 border-state-warning/20 font-medium',
    danger: 'bg-state-danger/6 text-state-danger/80 border-state-danger/20 font-medium',
  }[status];
};

/**
 * Returns Tailwind styling class for average badges.
 */
export const getAverageBadgeClass = (value: number) => {
  const status = getScoreStatus(value, false); // overall thresholds
  return {
    success: 'border-state-success/30 text-state-success bg-state-success/10',
    warning: 'border-state-warning/30 text-state-warning bg-state-warning/10',
    danger: 'border-state-danger/30 text-state-danger bg-state-danger/10',
  }[status];
};

/**
 * Returns Tailwind styling class for the Relevancy score tag specifically,
 * allowing muted styling if the query is a broad/summary query.
 */
export const getRelevancyTagClass = (score: number, isSummary = false) => {
  if (isSummary) {
    return 'bg-white/[0.04] text-text-secondary border-white/[0.12] font-medium cursor-help';
  }
  return getScoreTagClass(score);
};

/**
 * Returns the tooltip message for the Relevancy tag if it's a summary query.
 */
export const getRelevancyTooltip = (isSummary = false) => {
  if (isSummary) {
    return 'Relevancy is naturally lower for broad summary queries. This is expected behavior.';
  }
  return undefined;
};
