import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import type { AnalysisOverview, UserSession } from '../../types/chat';
import type { ToastMessage } from '../../components/common/feedback/Toast';
import { Spinner } from '../../components/common/spinners/Spinner';
import { EmptyState } from './components/EmptyState';

// Import subcomponents
import { AnalysisHeader } from './components/AnalysisHeader';
import { SummaryCards } from './components/SummaryCards';
import { ScoreShape } from './components/ScoreShape';
import { StatusCard } from './components/StatusCard';
import { WeakQueries } from './components/WeakQueries';
import { SessionBreakdown } from './components/SessionBreakdown';

interface AnalysisPageProps {
  user: UserSession;
  addToast: (text: string, type: ToastMessage['type']) => void;
}

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

  if (overview.summary.total_queries === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full h-[calc(100vh-56px)] overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 p-3 h-full">
        <section className="panel xl:col-span-8 flex flex-col overflow-hidden">
          <AnalysisHeader onBackToChat={() => navigate('/chat')} />

          <div className="scroll-area flex-1 p-4 space-y-4">
            <SummaryCards
              totalQueries={overview.summary.total_queries}
              totalSessions={overview.summary.total_sessions}
              avgLatencyMs={overview.summary.avg_latency_ms}
              retryRate={overview.summary.retry_rate}
              avgQuality={averageQuality}
              avgFaithfulness={overview.summary.avg_faithfulness}
              avgAnswerRelevancy={overview.summary.avg_answer_relevancy}
              avgConfidenceScore={overview.summary.avg_confidence_score}
              pipelineScore={overview.summary.pipeline_score}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <ScoreShape
                avgFaithfulness={overview.summary.avg_faithfulness}
                avgAnswerRelevancy={overview.summary.avg_answer_relevancy}
                avgConfidenceScore={overview.summary.avg_confidence_score}
                avgQuality={averageQuality}
              />

              <StatusCard
                statusBreakdown={overview.status_breakdown}
                failureRate={overview.summary.failure_rate}
              />
            </div>

            <WeakQueries
              weakQueries={overview.weak_queries}
              onQueryClick={(sessionId) => navigate(`/chat/${sessionId}`)}
            />
          </div>
        </section>

        <SessionBreakdown
          sessions={overview.session_breakdown}
          onSessionClick={(sessionId) => navigate(`/chat/${sessionId}`)}
        />
      </div>
    </div>
  );
};
