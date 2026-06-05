import React from 'react';
import { Spinner } from '../spinners/Spinner';
import { useTypingEffect } from '../../../utils/typing';

interface ChatEmptyStateProps {
  chatMessage: string;
  attachedFiles: File[];
  isUploading: boolean;
  isSending: boolean;
  canSubmit: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onMessageChange: (value: string) => void;
  onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (idx: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  chatMessage,
  attachedFiles,
  isUploading,
  isSending,
  canSubmit,
  fileInputRef,
  onMessageChange,
  onFileAttach,
  onRemoveFile,
  onSubmit,
}) => {
  const fullText = "Ask METO about your documents...";
  const typedTitle = useTypingEffect(fullText, 40, 100);
  const typedPlaceholder = useTypingEffect(fullText, 30, 1570);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <img src="/logo.svg" alt="METO Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight mb-8 min-h-[36px] flex items-center">
          {typedTitle}
          {typedTitle.length < fullText.length && (
            <span className="animate-pulse ml-0.5 font-light text-accent">|</span>
          )}
        </h1>

        {/* Input form panel */}
        <form onSubmit={onSubmit} className="w-full mb-6">
          
          {/* File chips tray inside empty state */}
          {attachedFiles.length > 0 && (
            <div className="file-chips-tray flex flex-wrap gap-1.5 mb-3 p-2 rounded-xl animate-slide-up bg-surface-raised border border-surface-border">
              {attachedFiles.map((file, idx) => {
                const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
                return (
                  <div key={idx} className="file-chip flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-surface-border">
                    <span className={`badge flex-shrink-0 ${ext === 'pdf' ? 'badge-pdf' : 'badge-txt'}`}>
                      {ext}
                    </span>
                    <span className="text-[11px] text-text-secondary max-w-[120px] truncate">{file.name}</span>
                    <span className="font-mono text-[9px] text-text-tertiary">
                      {(file.size / 1024).toFixed(0)}KB
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="text-text-tertiary hover:text-state-danger transition-colors ml-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upload progress indicator */}
          {isUploading && (
            <div className="flex items-center gap-2 mb-3 text-xs text-text-tertiary animate-fade-in">
              <Spinner size="sm" />
              <span>Indexing into RAG memory…</span>
            </div>
          )}

          {/* Centered large input bar */}
          <div 
            className="input-row flex flex-col gap-2 p-3 rounded-2xl"
            style={{
              background: 'rgba(24, 24, 27, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Input & buttons row */}
            <div className="flex items-center gap-3 w-full">
              {/* Hidden file picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf"
                multiple
                className="hidden"
                onChange={onFileAttach}
              />

              {/* Attach button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending || isUploading}
                title="Attach .txt or .pdf (max 2 MB)"
                className={`p-2 flex-shrink-0 rounded-xl hover:bg-white/[0.05] text-text-tertiary hover:text-text-primary transition-all duration-150 ${
                  attachedFiles.length > 0 ? 'text-accent' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>

              {/* Text input */}
              <input
                type="text"
                placeholder={typedPlaceholder}
                value={chatMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                disabled={isSending || isUploading}
                className="flex-grow bg-transparent outline-none border-none text-sm text-text-primary placeholder:text-text-tertiary py-1 px-0.5"
              />

              {/* Send button (solid white circle with black up arrow) */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: canSubmit ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                  color: canSubmit ? '#000000' : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {isUploading ? (
                  <Spinner size="sm" color="black" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
