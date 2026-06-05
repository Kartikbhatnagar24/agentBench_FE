import { useNavigate } from "react-router-dom";

export const EmptyState = () => {

    const navigate = useNavigate()
  return (
    <div className="w-full h-[calc(100vh-56px)] flex items-center justify-center p-4">
        <div className="panel max-w-lg w-full p-8 text-center flex flex-col items-center justify-center animate-in inset-highlight">
          <div className="empty-icon w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125C16.5 3.504 17.004 3 17.625 3h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full empty-icon-spark flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 21L14.907 14.195L9.813 15.904Z" />
                <path d="M14.187 8.096L15 3L9.093 9.805L14.187 8.096Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">No evaluation metrics yet</h2>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
            Metrics appear after your first conversation. Start a chat and run queries to see real-time pipeline confidence, retries, RAGAS scores, and latency stats.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/chat')}
              className="btn-accent px-6 w-full sm:w-auto shadow-lg shadow-accent/20"
            >
              Start a conversation
            </button>
          </div>
        </div>
      </div>
    );
}
