
export interface SignUpDto {
  email: string;
  password?: string;
  confirm_password?: string;
  first_name: string;
  last_name: string;
}

export interface SignInDto {
  email: string;
  password?: string;
}

export interface UserSession {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  token: string;
}

export const MessageSender = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const;

export type MessageSender = typeof MessageSender[keyof typeof MessageSender];

export interface ChatSession {
  id: string;
  user_id: string;
  first_message: string;
  created_at: string;
  messages: Array<{
    id: string;
    sender: MessageSender;
    text: string;
    timestamp: string;
  }>;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  size: string;
  content: string;
  uploaded_at: string;
}

export interface AnalysisSummary {
  total_sessions: number;
  total_queries: number;
  avg_faithfulness: number;
  avg_answer_relevancy: number;
  avg_confidence_score: number;
  avg_latency_ms: number;
  retry_rate: number;
  failure_rate: number;
  pipeline_score: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface SessionAnalysis {
  session_id: string;
  title: string;
  created_at?: string;
  total_queries: number;
  avg_faithfulness: number;
  avg_answer_relevancy: number;
  avg_confidence_score: number;
  avg_latency_ms: number;
  retry_rate: number;
  queries?: WeakQuery[];
}

export interface WeakQuery {
  message_id: string;
  session_id: string;
  question: string;
  answer: string;
  faithfulness: number;
  answer_relevancy: number;
  confidence_score: number;
  retry_count: number;
  latency_ms: number;
  status: string;
  is_summary?: boolean;
}

export interface RecentMetric {
  message_id: string;
  session_id: string;
  quality_score: number;
  faithfulness: number;
  answer_relevancy: number;
  confidence_score: number;
  latency_ms: number;
  status: string;
}

export interface AnalysisOverview {
  user_id: string;
  summary: AnalysisSummary;
  status_breakdown: StatusBreakdown[];
  session_breakdown: SessionAnalysis[];
  weak_queries: WeakQuery[];
  recent_metrics: RecentMetric[];
}

export interface BackendMessage {
  id?: string;
  role: 'user' | 'assistant';
  content?: string;
  text?: string;
  timestamp?: string;
}

export interface BackendChatSession {
  id: string | number;
  user_id: string;
  first_message: string;
  created_at?: string;
  messages?: BackendMessage[];
}

export interface UserProfile {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
}
