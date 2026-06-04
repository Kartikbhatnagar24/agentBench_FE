import React from 'react';

interface ChatEmptyStateProps {
  onUploadClick: () => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-10 animate-fade-in">
      {/* Document icon with spark badge */}
      <div className="empty-icon w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative">
        <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        {/* Spark badge */}
        <div className="empty-icon-spark absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
          </svg>
        </div>
      </div>

      <p className="text-base font-semibold text-text-primary mb-2">Ask your documents anything</p>
      <p className="text-sm text-text-tertiary text-center max-w-sm leading-relaxed mb-7">
        Upload a{' '}
        <code className="code-token font-mono text-accent/80 px-1 py-0.5 rounded">.pdf</code>
        {' '}or{' '}
        <code className="code-token font-mono text-accent/80 px-1 py-0.5 rounded">.txt</code>
        {' '}to ground your query in document context, then start chatting.
      </p>

      {/* Upload CTA */}
      <button
        type="button"
        id="empty-state-upload-btn"
        onClick={onUploadClick}
        className="btn-upload flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Upload document
      </button>

      <p className="text-[11px] text-text-tertiary mt-3 font-mono">or drop a file anywhere · max 2 MB</p>
    </div>
  );
};
